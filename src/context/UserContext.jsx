import { createContext, useState, useEffect } from "react";
import { weekDays } from "../constants/dateAndTimeConstants";
import { holidays } from "../constants/holidays";
import {
  getUserData,
  getGoogleData,
  requestAndSubscribe,
  getNotifications,
  getNotificationsAtStart,
  checkSubscription,
  addSubscriptionToUser,
  getGoogleCalendarEvents,
  markAsRead,
  getFriendInfo,
  getUserDataFresh,
  API_GetLocation,
  loginWithGoogle,
} from "../utils/api";
import QRCode from "qrcode-generator";
import IndexedDBManager from "../utils/indexDBApi";
import { H_FetchWeather } from "../utils/helpers";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || false,
  );
  const [events, setEvents] = useState([]);
  const [staticEvents, setStaticEvents] = useState([]);
  // const [googleEvents, setGoogleEvents] = useState([]);
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
  const [location, setLocation] = useState({
    city: "",
    state: "",
    lng: "",
    lat: "",
  });
  const [usersLocations, setUsersLocations] = useState([]); // {city: "", state: "", lng: "", lat: ""}
  const [weatherData, setWeatherData] = useState(null);
  const [notifSubs, setNotifSubs] = useState([]);

  // Update when necessary for indexedDB changes
  const myLocalDBVersion = Number(import.meta.env.VITE_INDEXED_DB_VERSION) || 3;

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
    if (localDB) {
      if (authToken) {
        localDB.setIndexedDBAuthToken(authToken);
      }

      M_GrabLocations();
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

  const M_GrabLocations = async () => {
    const dbLocations = (await localDB.getUserLocations()) || [];

    console.log(
      "User pulled locations from indexedDB and is setting them in state",
    );
    console.dbLocations;
    setUsersLocations(dbLocations);
  };

  const M_FetchLocation = async (lng, lat) => {
    try {
      const response = await API_GetLocation(lng, lat, 1);

      const data = response?.data;

      if (!data) {
        return;
      }

      const city = data[0]?.name;
      const state = data[0]?.state;

      if (!city || !state) {
        return;
      }

      const locationObj = {
        city: city,
        state: state,
        lng: lng,
        lat: lat,
      };

      setLocation(locationObj);

      const includes = usersLocations.some(
        (l) => l.city === city && l.state === state,
      );

      if (!includes) {
        console.log(usersLocations);
        setUsersLocations((prev) => [...prev, locationObj]);
      }

      M_FetchWeather(lng, lat);
    } catch (err) {
      console.log(err);
    }
  };

  const M_FetchWeather = async (lng, lat) => {
    const weather = await H_FetchWeather(lng, lat);
    setWeatherData(weather);
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
      completeAutomaticGoogleLogin();
    }
  }, [isOnline, googleToken]);

  const completeAutomaticGoogleLogin = async () => {
    const resetOnFailure = () => {
      setUser(false);
      setEvents(localStorage.getItem("events") || []);
    };

    try {
      const googleLoginData = await getGoogleData(googleToken);

      try {
        if (googleLoginData?.data) {
          const CNGLoginResponse = await loginWithGoogle(googleLoginData.data);

          if (CNGLoginResponse?.data) {
            setUser(CNGLoginResponse.data.user);
            setAuthToken(CNGLoginResponse.data.token);
            localStorage.setItem("authToken", CNGLoginResponse.data.token);
          } else {
            throw new Error("loginWithGoogle() succeeded but returned no data");
          }
        } else {
          throw new Error("getGoogleData() succeeded but returned no data");
        }
      } catch (err) {
        console.log("Error logging in to CNG using Google");
        console.log(err);
        resetOnFailure();
      }
    } catch (err) {
      console.log("Error with grabbing Google login auth data");
      console.log(err);
      resetOnFailure();
    }
  };

  const continueRequests = async (user) => {
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
            func: () => M_FetchGoogleEvents(googleToken),
          },
        ],
      };
      setSystemNotif(newNotif);
    }

    // The user clearly has no notification subscription and potentially never accepted permissions
    if (user.notifSub?.length < 1 || user.notifSub === null) {
      M_RequestPermissionsAndSubscribe(authToken);
    }

    // User has at least one subscription that is valid
    if (user.notifSub?.length > 0 && user.notifSub !== null) {
      const sub = await checkSubscription();

      const isAtLeastOneSubValid = user.notifSub.some((s) => {
        try {
          const subEndpoint = JSON.parse(s)?.endpoint;
          subEndpoint ? true : false;
        } catch (err) {
          return false;
        }
      });

      // If not a single subscription is valid. Then we need to make sure we request new
      if (!isAtLeastOneSubValid) {
        M_RequestPermissionsAndSubscribe(authToken);
        return;
      }

      const userHasSub = user.notifSub.some((storedSub) => {
        try {
          const subEndpoint = JSON.parse(storedSub)?.endpoint;
          subEndpoint ? true : false;
        } catch (err) {
          return false;
        }
      });

      if (userHasSub) {
        send(authToken, user);
      }

      if (!userHasSub) {
        try {
          const newUserRes = await addSubscriptionToUser(sub, authToken);

          localStorage.setItem("authToken", newUserRes.data.token);
          localStorage.setItem("user", JSON.stringify(newUserRes.data.user));

          setUser(newUserRes.data.user);
          send(newUserRes.data.token, newUserRes.data.user);
        } catch (err) {
          console.log("Error adding new subscription to user");
          console.log(err);
        }
      }
    }

    try {
      const friendInformation = await getFriendInfo(authToken);

      if (!friendInformation?.data) {
        throw new Error("getFriendInfo() succeeded but returned no data");
      }

      const data = response.data;
      setFriends(data.userFriends);
      setFriendRequests(data.friendRequests);
      setConnectionRequests(data.connectionRequests);
    } catch (err) {
      console.log("Error fetching friend info from server");
      console.log(err);
    }
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
    setNotifSubs(user.notifSub || []);
    setLists(sortedLists);
    setKanbans(user.kanbans);
    setStickies(sortedStickies);
    M_GenerateQrCode(user.email);
    setUserTasks(sortedTasks);
    if (fresh) {
      continueRequests(user);
    }
  };

  useEffect(() => {
    if (authToken) {
      M_Async_LoadApp();
    }
    if (!authToken && user) {
      console.log("No token user there");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localDB.removeAuth();
      setUser(false);
    }
  }, [authToken]);

  const M_Async_LoadApp = async () => {
    try {
      const userData = await getUserData(authToken);

      if (!userData?.data) {
        throw new Error(
          "getUserData() succeeded but returned no data. Server error",
        );
      }

      const user = userData.data?.user;
      updateUI(user, true);
      registerServiceWorkerSync();
    } catch (err) {
      console.log("Error fetching user data from the server");
      console.log(err);
    }
  };

  const M_GenerateQrCode = (userEmail) => {
    const qr = QRCode(0, "L");
    const data = `https://calendar-next-gen-production.up.railway.app/friends/add/request/qrcode/${userEmail}`;
    qr.addData(data);
    qr.make();
    const qrCodeDataUrl = qr.createDataURL(4);
    setQrCodeUrl(qrCodeDataUrl);
  };

  const M_FetchGoogleEvents = (googleToken) => {
    setSystemNotif({ show: false });
    getGoogleCalendarEvents(authToken, googleToken)
      .then((res) => {
        const events = res.data.events;
        console.log("Here are your google events pulled in from google");
        console.log(events);
      })
      .catch((err) => console.log(err));
  };

  const M_RequestPermissionsAndSubscribe = async (token) => {
    try {
      requestAndSubscribe(token)
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          send(data.token, data.user);
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

  const send = async (token, user) => {
    if (!user.id || !user) {
      return;
    }
    try {
      const serverSentSource = getNotifications(user.id);
      getNotificationsAtStart(user.username, token)
        .then((res) => {
          console.log(
            "Get notifications at start returned a success. Setting notifications",
          );
          const oldNotifs = res.data.notifs;
          const sortedOldNotifs = oldNotifs.sort((a, b) => b.time - a.time);
          setNotifications(sortedOldNotifs);
          setupNotifListener(serverSentSource, user.id);
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
    const request = indexedDB.open("myCalngDB", myLocalDBVersion);
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
        eventMap,
        eventMapDays,
        weatherData,
        location,
        usersLocations,
        notifSubs,
        localDB,
        setNotifSubs,
        setWeatherData,
        setLocation,
        setUsersLocations,
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
        setEventMap,
        setEventMapDays,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
