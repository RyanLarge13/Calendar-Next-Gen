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
  getFriendInfo,
  getUserDataFresh,
  API_GetLocation,
  API_GetWeather,
} from "../utils/api";
import QRCode from "qrcode-generator";
import IndexedDBManager from "../utils/indexDBApi";
import { eventIsAllDay } from "../utils/helpers.js";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || false,
  );
  const [events, setEvents] = useState([]);
  const [staticEvents, setStaticEvents] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [preferences, setPreferences] = useState(
    JSON.parse(localStorage.getItem("preferences")) || {},
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
  const [eventMap, setEventMap] = useState(new Map());
  const [eventMapDays, setEventMapDays] = useState(new Map());
  const [location, setLocation] = useState({ city: "", state: "" });
  const [weatherData, setWeatherData] = useState(null);

  const updateStatus = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    const handleSWMessage = (event) => {
      console.log(
        `Message from service worker to client, type: ${event.data.type}`,
      );
      if (event.data && event.data.type === "user-cache-update") {
        getUserDataFresh()
          .then((res) => {
            if (res.status !== 200) {
              throw new Error(
                `No cache in service worker. Response status: ${res.status}`,
              );
            }
            return res;
          })
          .then((res) => {
            const user = res.data.user;
            updateUI(user, false);
          })
          .catch((err) => {
            console.log(err);
            console.log("No cache in service worker");
          });
      }
    };
    navigator.serviceWorker.addEventListener("message", handleSWMessage);
    return () =>
      navigator.serviceWorker.removeEventListener("message", handleSWMessage);
  }, []);

  useEffect(() => {
    if (localDB && authToken) {
      console.log("localDB exists and auth token also does, setting in db now");
      localDB.setIndexedDBAuthToken(authToken);
    }
  }, [localDB, authToken]);

  useEffect(() => {
    const currentDate = new Date();
    const filteredEvents = events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        const diff = Math.ceil(
          (eventDate - currentDate) / (25 * 60 * 60 * 1000),
        );
        return diff >= 0 && diff <= 8;
      })
      .map((event) => ({
        ...event,
        diff: Math.ceil(
          (new Date(event.startDate) - currentDate) / (25 * 60 * 60 * 1000),
        ),
      }))
      .sort((a, b) => a.diff - b.diff);
    setUpcoming(filteredEvents);
  }, [events]);

  const M_FetchLocation = async (lon, lat) => {
    try {
      const response = await API_GetLocation(lon, lat, 1);

      setLocation({
        city: response.data[0].name,
        state: response.data[0].state,
      });

      M_FetchWeather(lon, lat);
    } catch (err) {
      console.log(err);
    }
  };

  const M_FetchWeather = async (lon, lat) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await API_GetWeather(lon, lat, timeZone);
    const data = response.data;

    setWeatherData(data);
  };

  useEffect(() => {
    // Immediately open indexDb
    createIndexedDb();
    navigator?.geolocation.getCurrentPosition((position) => {
      const long = position?.coords?.longitude;
      const lat = position?.coords?.latitude;

      if (long && lat) {
        M_FetchLocation(long, lat);
      }
    });
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
            func: () => setSystemNotif({ show: false }),
          },
          { text: "refresh", func: () => window.location.reload() },
        ],
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
            func: () => setSystemNotif({ show: false }),
          },
        ],
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

  const buildEventsMap = (eventsToMap) => {
    const newMap = new Map();
    // const newMapDays = new Map();
    const allEvents = eventsToMap.concat(holidays);

    allEvents.forEach((evt) => {
      const date = new Date(evt.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!newMap.has(key)) {
        newMap.set(key, { events: [evt] });
      } else {
        newMap.get(key).events.push(evt);
      }

      if (evt.repeats.repeat) {
        if (!newMap.has("repeat-events")) {
          newMap.set("repeat-events", { events: [evt] });
        } else {
          newMap.get("repeat-events").events.push(evt);
        }
      }
    });
    setEventMap(new Map(newMap));
  };

  useEffect(() => {
    if (googleToken && !authToken) {
      getGoogleData(googleToken)
        .then((res) => {
          loginWithGoogle(res.data)
            .then((response) => {
              setUser(response.data.user);
              setAuthToken(response.data.token);
              localStorage.setItem("authToken", response.data.token);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
          setUser(false);
          setEvents(localStorage.getItem("events") || []);
        });
    }
  }, [isOnline, googleToken]);

  const continueRequests = (user) => {
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
            func: () => setSystemNotif({ show: false }),
          },
          {
            text: "get events",
            func: () => fetchGoogleEvents(googleToken),
          },
        ],
      };
      setSystemNotif(newNotif);
    }
    if (user.notifSub?.length < 1 || user.notifSub === null) {
      requestPermissionsAndSubscribe(authToken);
    }
    if (user.notifSub?.length > 0 && user.notifSub !== null) {
      checkSubscription().then((sub) => {
        const userHasSub = user.notifSub.some(
          (item) => JSON.parse(item).endpoint === sub.endpoint,
        );
        if (userHasSub) {
          send(authToken, user.id);
        }
        if (!userHasSub) {
          addSubscriptionToUser(sub, authToken)
            .then((newUserRes) => {
              setUser(newUserRes.data.user);
              localStorage.setItem("authToken", newUserRes.data.token);
              localStorage.setItem(
                "user",
                JSON.stringify(newUserRes.data.user),
              );
              send(newUserRes.data.token, newUserRes.data.user.id);
            })
            .catch((err) => {
              console.log(`Error with adding new subscription: ${err}`);
            });
        }
      });
    }
    getFriendInfo(authToken)
      .then((response) => {
        const data = response.data;
        setFriends(data.userFriends);
        setFriendRequests(data.friendRequests);
        setConnectionRequests(data.connectionRequests);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUI = (user, fresh) => {
    const basicUser = {
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      id: user.id,
      birthday: user.birthday,
      createdAt: user.createAt,
    };
    setUser(basicUser);
    localStorage.setItem("user", JSON.stringify(basicUser));
    setEvents(user.events);
    buildEventsMap(user.events);
    setStaticEvents(user.events);
    const sortedReminders = user.reminders.sort(
      (a, b) => new Date(a.time) - new Date(b.time),
    );
    setReminders(sortedReminders);
    const sortedLists = user.lists.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
    const sortedTasks = user.tasks.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
    const sortedStickies = user.stickies.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
    setLists(sortedLists);
    setKanbans(user.kanbans);
    setStickies(sortedStickies);
    generateQrCode(user.email);
    setUserTasks(sortedTasks);
    if (fresh) {
      continueRequests(user);
    }
  };

  useEffect(() => {
    if (authToken) {
      getUserData(authToken)
        .then((res) => {
          const user = res.data.user;
          updateUI(user, true);
        })
        .catch((err) => {
          console.log(err);
        });
      registerServiceWorkerSync();
    }
    if (!authToken && user) {
      console.log("No token user there");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localDB.removeAuth();
      setUser(false);
    }
  }, [authToken]);

  const generateQrCode = (userEmail) => {
    const qr = QRCode(0, "L");
    const data = `https://calendar-next-gen-production.up.railway.app/friends/add/request/qrcode/${userEmail}`;
    qr.addData(data);
    qr.make();
    const qrCodeDataUrl = qr.createDataURL(4);
    setQrCodeUrl(qrCodeDataUrl);
  };

  const fetchGoogleEvents = (googleToken) => {
    setSystemNotif({ show: false });
    getGoogleCalendarEvents(authToken, googleToken)
      .then((res) => {
        const events = res.data.events;
        console.log(events);
      })
      .catch((err) => console.log(err));
  };

  const requestPermissionsAndSubscribe = async (token) => {
    try {
      requestAndSubscribe(token)
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          send(data.token, data.user.id);
        })
        .catch((err) => {
          console.log("Error calling request and subscribe to notifications");
          console.log(err);
        });
    } catch (err) {
      console.error(
        "Error getting service worker registration after calling request and subscribe:",
        err,
      );
    }
  };

  const send = async (token, userId) => {
    if (!userId) {
      return;
    }
    try {
      const serverSentSource = getNotifications(userId);
      getNotificationsAtStart(user.username, token)
        .then((res) => {
          console.log(
            "Get notifications at start returned a success. Setting notifications",
          );
          const oldNotifs = res.data.notifs;
          const sortedOldNotifs = oldNotifs.sort((a, b) => b.time - a.time);
          setNotifications(sortedOldNotifs);
          setupNotifListener(serverSentSource, userId);
        })
        .catch((err) => {
          console.log(
            "Getting notifications at start failed inside send funciton",
          );
          console.log(err);
        });
    } catch (err) {
      console.log("Error in send function catch block");
      console.log(err);
    }
  };

  const setupNotifListener = (serverSentSource, userId) => {
    console.log("Set up and listening for notifications");
    serverSentSource.addEventListener("open", () => {
      console.log(`New SSE connection open ${serverSentSource}`);
    });
    serverSentSource.addEventListener("message", (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);
      setSystemNotif({
        show: true,
        title: notification.notifData.title,
        text: notification.notifData.notes,
        color: "bg-purple-300",
        hasCancel: true,
        actions: [
          {
            text: "close",
            func: () => setSystemNotif({ show: false }),
          },
          {
            text: "mark as read",
            func: () => markAsReadClient(notification.id),
          },
        ],
      });
      console.log("Received notification:", notification);
    });
    serverSentSource.addEventListener("error", (error) => {
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
        serverSentSource.close();
      }
    });
  };

  const markAsReadClient = (notifId) => {
    setNotifications((prevNotifs) => {
      const updated = prevNotifs.map((notif) =>
        notif.id === notifId ? { ...notif, read: true } : notif,
      );
      const sorted = updated.sort((a, b) => b.time - a.time);
      return sorted;
    });
    setSystemNotif({ show: false });
    markAsRead(notifId);
  };

  const createIndexedDb = () => {
    const request = indexedDB.open("myCalngDB", 2);
    const calngIndexDBManager = new IndexedDBManager(request);
    setLocalDB(calngIndexDBManager);
  };

  const registerServiceWorkerSync = () => {
    navigator.serviceWorker.ready.then((registration) => {
      if ("periodicSync" in registration) {
        console.log("Period sync in service worker");
        return registration.periodicSync.getTags().then((tags) => {
          if (tags.includes("periodic-sync")) {
            return;
          }
          registration.periodicSync.register("periodic-sync", {
            minInterval: 24 * 60 * 60 * 1000,
          });
        });
      }
      // Commenting out background sync for now until I am ready to implement the logic
      // return registration.sync.register("background-sync");
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
        setReminders,
        eventMap,
        setEventMap,
        eventMapDays,
        setEventMapDays,
        weatherData,
        location,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
