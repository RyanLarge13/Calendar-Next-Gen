import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineMail, AiOutlineQrcode } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import jsQR from "jsqr";
import UserContext from "../../../context/UserContext";
import { getFriendInfo, sendFriendRequestByEmail } from "../../../utils/api";

const decodeFriendQR = (raw) => {
  try {
    const url = new URL(raw);
    if (url.hostname !== "calendar-next-gen-production.up.railway.app") return null;
    const match = url.pathname.match(/^\/friends\/add\/request\/qrcode\/([^/]+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch { return null; }
};

const Friends = () => {
  const { user, friends = [], qrCodeUrl, preferences, setFriends, setFriendRequests, setConnectionRequests } = useContext(UserContext);
  const [pick, setPick] = useState(false);
  const [method, setMethod] = useState("qr");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const inputRef = useRef(null);
  const dark = preferences.darkMode;
  const panel = dark ? "bg-[#202020] border-amber-200/15 text-white" : "bg-white border-amber-200/60 text-slate-900";
  const button = "rounded-xl border border-amber-400/30 px-3 py-2 text-sm font-medium hover:bg-amber-400/10 transition";

  const stopCamera = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setScanning(false);
  };
  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const requestFriend = async (recipient) => {
    const address = recipient.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { setMessage("Enter a valid email address or scan a valid connection QR code."); return; }
    if (address === user?.email?.toLowerCase()) { setMessage("You cannot send a friend request to yourself."); return; }
    const token = localStorage.getItem("authToken");
    if (!token) { setMessage("Sign in to send friend requests."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await sendFriendRequestByEmail(address, token);
      const latest = await getFriendInfo(token);
      if (latest?.data) {
        setFriends(latest.data.userFriends || []);
        setFriendRequests(latest.data.friendRequests || []);
        setConnectionRequests(latest.data.connectionRequests || []);
      }
      setMessage(response.data?.message || "Friend request sent.");
      setEmail("");
    } catch (error) { setMessage(error.response?.data?.message || "Could not send the request."); }
    finally { setBusy(false); }
  };

  const handleScanned = (raw) => {
    const address = decodeFriendQR(raw);
    stopCamera();
    if (!address) { setMessage("This is not a valid Aurea connection QR code."); return; }
    setEmail(address); setMethod("email");
    setMessage(`Scanned ${address}. Review the address and select Send request.`);
  };

  const scanFrame = () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(video, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: "dontInvert" });
      if (result) { handleScanned(result.data); return; }
    }
    frameRef.current = requestAnimationFrame(scanFrame);
  };

  const startCamera = async () => {
    setMessage("");
    if (!navigator.mediaDevices?.getUserMedia) { setMessage("Camera scanning requires HTTPS and camera access."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream; setScanning(true);
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); frameRef.current = requestAnimationFrame(scanFrame); }
    } catch { stopCamera(); setMessage("Could not open the camera. Check camera permissions."); }
  };

  const scanImage = async (file) => {
    if (!file) return;
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas"); canvas.width = bitmap.width; canvas.height = bitmap.height;
      const context = canvas.getContext("2d", { willReadFrequently: true }); context.drawImage(bitmap, 0, 0); bitmap.close();
      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(data.data, data.width, data.height);
      if (result) handleScanned(result.data);
      else setMessage("No readable QR code found in that image.");
    } catch { setMessage("Could not read the selected image."); }
    if (inputRef.current) inputRef.current.value = "";
  };

  return <div className="mt-3 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div><h3 className="font-semibold text-lg">Friends</h3><p className="text-xs opacity-60">{friends.length} connected</p></div>
      <button type="button" className="rounded-xl bg-amber-500 text-slate-950 px-4 py-2 text-sm font-semibold" onClick={() => setPick((prev) => !prev)}>+ Add friend</button>
    </div>
    {pick && <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border p-4 space-y-4 ${panel}`}>
      <div className="flex gap-2">
        <button type="button" className={button} onClick={() => { stopCamera(); setMethod("qr"); }}><AiOutlineQrcode className="inline mr-2" />QR code</button>
        <button type="button" className={button} onClick={() => { stopCamera(); setMethod("email"); }}><AiOutlineMail className="inline mr-2" />Email</button>
      </div>
      {method === "qr" && <div className="space-y-3">
        <p className="text-sm font-semibold">Your connection code</p>
        {qrCodeUrl ? <img src={qrCodeUrl} alt="Your connection QR code" className="w-48 h-48 mx-auto rounded-xl bg-white p-2" /> : <p className="text-sm opacity-60">QR code unavailable. Sign in again to generate it.</p>}
        <p className="text-xs opacity-60 text-center">Let a friend scan this code to prepare a friend request.</p>
        <button type="button" className={button} onClick={scanning ? stopCamera : startCamera}>{scanning ? "Stop scanning" : "Scan friend's QR code"}</button>
        <input ref={inputRef} type="file" accept="image/*" className="block text-xs w-full" aria-label="Scan QR code from an image" onChange={(event) => scanImage(event.target.files?.[0])} />
        {scanning && <video ref={videoRef} playsInline muted autoPlay className="w-full rounded-xl bg-black aspect-video object-cover" />}
      </div>}
      {method === "email" && <form onSubmit={(event) => { event.preventDefault(); requestFriend(email); }} className="space-y-3">
        <label className="block text-sm font-medium">Friend's email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="friend@example.com" className={`block w-full mt-2 rounded-xl border px-3 py-2 bg-transparent ${dark ? "border-white/20" : "border-black/20"}`} /></label>
        <button type="submit" disabled={busy} className="rounded-xl bg-amber-500 text-slate-950 px-4 py-2 text-sm font-semibold disabled:opacity-50">{busy ? "Sending…" : "Send friend request"}</button>
      </form>}
      {message && <p role="status" className="text-sm text-amber-600 dark:text-amber-300">{message}</p>}
    </motion.section>}
    {friends.length ? <div className="space-y-2">{friends.map((friend) => <div key={friend.id} className={`rounded-2xl border p-3 flex items-center gap-3 ${panel}`}>
      {friend.friendAvatar ? <img src={friend.friendAvatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-amber-400/20 grid place-items-center"><IoIosAddCircle /></div>}
      <div className="min-w-0"><p className="font-medium text-sm truncate">{friend.friendEmail || "Connected friend"}</p><p className="text-xs opacity-60">Connected</p></div>
    </div>)}</div> : <div className={`rounded-2xl border p-6 text-center ${panel}`}><p className="font-semibold">No connections yet</p><p className="text-sm opacity-60 mt-2">Share your QR code or invite a friend by email.</p></div>}
  </div>;
};
export default Friends;
