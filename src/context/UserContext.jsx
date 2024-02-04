import { createContext, useState, useEffect } from "react";
import { holidays, weekDays } from "../constants";
import {
    getUserData,
    getGoogleData,
    loginWithGoogle,
    getEvents,
    getReminders,
    requestAndSubscribe,
    getAllLists,
    getAllTasks,
    getNotifications,
    getNotificationsAtStart,
    checkSubscription,
    addSubscriptionToUser,
    getGoogleCalendarEvents,
    markAsRead,
    getFriendinfo
} from "../utils/api";
import QRCode from "qrcode-generator";
import IndexedDBManager from "../utils/indexDBApi";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("authToken") || false
    );
    const [events, setEvents] = useState([]);
    const [staticEvents, setStaticEvents] = useState([]);
    const [googleEvents, setGoogleEvents] = useState([]);
    const [preferences, setPreferences] = useState(
        JSON.parse(localStorage.getItem("preferences")) || {}
    );
    const [upcoming, setUpcoming] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [lists, setLists] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [stickies, setStickies] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [friends, setFriends] = useState([]);
    const [kanbans, setKanbans] = useState([]);
    const [connectionRequests, setConnectionRequests] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [localDB, setLocalDB] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [systemNotif, setSystemNotif] = useState({ show: false });
    const [backOnlineTrigger, setBackOnlineTrigger] = useState(false);
    const [googleToken, setGoogleToken] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);

    const updateStatus = () => {
        setIsOnline(navigator.onLine);
    };

    useEffect(() => {
        const currentDate = new Date();
        const filteredEvents = events
            .filter(event => {
                const eventDate = new Date(event.startDate);
                const diff = Math.ceil(
                    (eventDate - currentDate) / (25 * 60 * 60 * 1000)
                );
                return diff >= 0 && diff <= 8;
            })
            .map(event => ({
                ...event,
                diff: Math.ceil(
                    (new Date(event.startDate) - currentDate) /
                        (25 * 60 * 60 * 1000)
                )
            }))
            .sort((a, b) => a.diff - b.diff);
        setUpcoming(filteredEvents);
    }, [events]);

    useEffect(() => {
        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);
        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
        };
    }, []);

    useEffect(() => {
        let refreshTimeout;
        if (!isOnline) {
            const newNotif = {
                show: true,
                title: "Network",
                text: "You are offline",
                color: "bg-red-300",
                hasCancel: true,
                actions: [
                    {
                        text: "close",
                        func: () => setSystemNotif({ show: false })
                    },
                    { text: "refresh", func: () => window.location.reload() }
                ]
            };
            refreshTimeout = setTimeout(() => {
                setRefresh(true);
            }, 600000);
            setSystemNotif(newNotif);
            setBackOnlineTrigger(true);
        }
        if (isOnline && backOnlineTrigger === true) {
            if (!refresh) {
                clearTimeout(refreshTimeout);
            }
            // Logic to show notification when going back online
            const newNotif = {
                show: true,
                title: "Network",
                text: "You are back online",
                color: "bg-green-300",
                hasCancel: true,
                actions: [
                    {
                        text: "close",
                        func: () => setSystemNotif({ show: false })
                    }
                ]
            };
            setSystemNotif(newNotif);
            setBackOnlineTrigger(false);
            if (refresh) {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    }, [isOnline]);

    useEffect(() => {
        if (googleToken && !authToken) {
            getGoogleData(googleToken)
                .then(res => {
                    loginWithGoogle(res.data)
                        .then(response => {
                            setUser(response.data.user);
                            setAuthToken(response.data.token);
                            localStorage.setItem(
                                "authToken",
                                response.data.token
                            );
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                    setUser(false);
                    setEvents(localStorage.getItem("events") || []);
                });
        }
    }, [isOnline, googleToken]);

    useEffect(() => {
        if (authToken) {
            getUserData(authToken)
                .then(res => {
                    const user = res.data.user;
                    const basicUser = {
                        username: user.username,
                        email: user.email,
                        avatarUrl: user.avatarUrl,
                        id: user.id,
                        birthday: user.birthday,
                        createdAt: user.createAt
                    };
                    setUser(basicUser);
                    localStorage.setItem("user", JSON.stringify(basicUser));
                    if (user.importedGoogleEvents) {
                        const newNotif = {
                            show: true,
                            title: "Google Events",
                            text: "Would you like to import your google calendar events?",
                            color: "bg-sky-300",
                            hasCancel: true,
                            actions: [
                                {
                                    text: "close",
                                    func: () => setSystemNotif({ show: false })
                                },
                                {
                                    text: "get events",
                                    func: () =>
                                        fetchGoogleEvents(
                                            authToken,
                                            googleToken
                                        )
                                }
                            ]
                        };
                        setSystemNotif(newNotif);
                    }
                    if (user.notifSub?.length < 1 || user.notifSub === null) {
                        requestPermissonsAndSubscribe(authToken);
                    }
                    if (user.notifSub?.length > 0 && user.notifSub !== null) {
                        checkSubscription().then(sub => {
                            const userHasSub = user.notifSub.some(
                                item =>
                                    JSON.parse(item).endpoint === sub.endpoint
                            );
                            if (userHasSub) {
                                send(authToken, user.id);
                            }
                            if (!userHasSub) {
                                addSubscriptionToUser(sub, authToken)
                                    .then(newUserRes => {
                                        setUser(newUserRes.data.user);
                                        localStorage.setItem(
                                            "authToken",
                                            newUserRes.data.token
                                        );
                                        localStorage.setItem(
                                            "user",
                                            JSON.stringify(newUserRes.data.user)
                                        );
                                        send(
                                            newUserRes.data.token,
                                            newUserRes.data.user.id
                                        );
                                    })
                                    .catch(err => {
                                        console.log(
                                            `Error with adding new subscription: ${err}`
                                        );
                                    });
                            }
                        });
                    }
                    setEvents(user.events);
                    setStaticEvents(user.events);
                    const sortedReminders = user.reminders.sort(
                        (a, b) => new Date(a.time) - new Date(b.time)
                    );
                    setReminders(sortedReminders);
                    const sortedLists = user.lists.sort(
                        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    );
                    setLists(sortedLists);
                    setKanbans(user.kanbans);
                    setStickies(user.stickies);
                    generateQrCode(user.email);
                    setUserTasks(user.tasks);
                    getFriendinfo(authToken)
                        .then(response => {
                            const data = response.data;
                            console.log(data.userFriends);
                            setFriends(data.userFriends);
                            setFriendRequests(data.friendRequests);
                            setConnectionRequests(data.connectionRequests);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
            registerServiceWorkerSync();
        }
        if (!authToken && user) {
            localStorage.removeItem("authToken");
            setUser(false);
            openIndexDB();
        }
    }, [authToken]);

    const generateQrCode = userEmail => {
        const qr = QRCode(0, "L");
        const data = `https://calendar-next-gen-production.up.railway.app/friends/add/request/qrcode/${userEmail}`;
        qr.addData(data);
        qr.make();
        const qrCodeDataUrl = qr.createDataURL(4);
        setQrCodeUrl(qrCodeDataUrl);
    };

    const fetchGoogleEvents = (authToken, googleToken) => {
        setSystemNotif({ show: false });
        getGoogleCalendarEvents(authToken, googleToken)
            .then(res => {
                const events = res.data.events;
                console.log(events);
            })
            .catch(err => console.log(err));
    };

    const requestPermissonsAndSubscribe = async token => {
        try {
            requestAndSubscribe(token)
                .then(res => res.json())
                .then(data => {
                    setUser(data.user);
                    localStorage.setItem("authToken", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    send(data.token, data.user.id);
                })
                .catch(err => console.log(err));
        } catch (err) {
            console.error("Error getting service worker registration:", err);
        }
    };

    const send = async (token, userId) => {
        try {
            const serverSentSource = getNotifications(userId);
            getNotificationsAtStart(user.username, token)
                .then(res => {
                    const oldNotifs = res.data.notifs;
                    const sortedOldNotifs = oldNotifs.sort(
                        (a, b) => b.time - a.time
                    );
                    setNotifications(sortedOldNotifs);
                    setupNotifListener(serverSentSource, userId);
                })
                .catch(err => {
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const setupNotifListener = (serverSentSource, userId) => {
        console.log("Set up and listening for notifications");
        serverSentSource.addEventListener("open", () => {
            console.log(`New SSE connection open ${serverSentSource}`);
        });
        serverSentSource.addEventListener("message", event => {
            const notification = JSON.parse(event.data);
            setNotifications(prev => [notification, ...prev]);
            setSystemNotif({
                show: true,
                title: notification.notifData.title,
                text: notification.notifData.notes,
                color: "bg-purple-300",
                hasCancel: true,
                actions: [
                    {
                        text: "close",
                        func: () => setSystemNotif({ show: false })
                    },
                    {
                        text: "mark as read",
                        func: () => markAsReadClient(notification.id)
                    }
                ]
            });
            console.log("Received notification:", notification);
        });
        serverSentSource.addEventListener("error", error => {
            console.error("SSE error:", error);
            serverSentSource.close();
            setTimeout(() => {
                console.log("Attempting SSE reconnection...");
                const newConnection = getNotifications(userId);
                return setupNotifListener(newConnection, userId);
            }, 15000);
        });
        window.addEventListener("beforeunload", () => {
            if (serverSentSource !== null) {
                serverSentSource.close(); // Close the SSE connection before unloading the window
            }
        });
    };

    const markAsReadClient = notifId => {
        setNotifications(prevNotifs => {
            const updated = prevNotifs.map(notif =>
                notif.id === notifId ? { ...notif, read: true } : notif
            );
            const sorted = updated.sort((a, b) => b.time - a.time);
            return sorted;
        });
        setSystemNotif({ show: false });
        markAsRead(notification.id);
    };

    const openIndexDB = () => {
        const request = indexedDB.open("myCalngDB", 1);
        const calngIndexDBManager = new IndexedDBManager(request);
        setLocalDB(calngIndexDBManager);
    };

    const registerServiceWorkerSync = () => {
        navigator.serviceWorker.ready.then(registration => {
            if ("periodicSync" in registration) {
                registration.periodicSync.register({
                    tag: "periodic-sync",
                    minInterval: 24 * 60 * 60 * 1000 // Minimum interval in milliseconds
                });
            }
            return registration.sync.register("background-sync");
        });
    };

    return (
        <UserContext.Provider
            value={{
                holidays,
                weekDays,
                user,
                events,
                reminders,
                googleToken,
                isOnline,
                lists,
                notifications,
                systemNotif,
                friends,
                stickies,
                userTasks,
                kanbans,
                qrCodeUrl,
                connectionRequests,
                friendRequests,
                upcoming,
                staticEvents,
                preferences,
                setPreferences,
                setKanbans,
                setConnectionRequests,
                setFriendRequests,
                setUserTasks,
                setStickies,
                setFriends,
                setSystemNotif,
                setNotifications,
                setLists,
                setUser,
                setEvents,
                setGoogleToken,
                setAuthToken,
                setReminders
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
