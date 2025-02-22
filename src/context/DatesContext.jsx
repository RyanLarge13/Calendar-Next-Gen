import { createContext, useState, useEffect } from "react";
import { weekDays } from "../constants";

const DatesContext = createContext({});

export const DatesProvider = ({ children }) => {
	const dateObj = new Date();
	const [weekDateObj, setWeekDateObj] = useState(new Date());
	const [weekOffset, setWeekOffset] = useState(0);
	const [nav, setNav] = useState(0);
	const [dt, setDt] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const [day, setDay] = useState(new Date().getDate());
	const [month, setMonth] = useState(dt.getMonth());
	const [year, setYear] = useState(dt.getFullYear());
	const [firstDayOfMonth, setFirstDayOfMonth] = useState(
		new Date(year, month, 1)
	);
	const [daysInMonth, setDaysInMonth] = useState(
		new Date(year, month + 1, 0).getDate()
	);
	const [dateString, setDateString] = useState(``);
	const [paddingDays, setPaddingDays] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [string, setString] = useState(new Date().toLocaleDateString());
	const [secondString, setSecondString] = useState("");
	const [theDay, setTheDay] = useState(new Date());
	const [rowDays, setRowDays] = useState([]);
	const [currentWeek, setCurrentWeek] = useState([]);
	const [updatedDate, setUpdatedDate] = useState(new Date());

	useEffect(() => {
		setLoading(true);
		const newDate = new Date(updatedDate);
		newDate.setDate(1);
		newDate.setMonth(newDate.getMonth() + nav);
		setDt(newDate);
	}, [nav, updatedDate]);

	const finish = (e, info) => {
		const dragDistance = info.offset.x;
		const cancelThreshold = 175;

		if (dragDistance > cancelThreshold) {
			setNav(prev => prev - 1);
		} else if (dragDistance < -cancelThreshold) {
			setNav(prev => prev + 1);
		}
	};

	useEffect(() => {
		setMonth(dt.getMonth());
		setYear(dt.getFullYear());
	}, [dt]);

	useEffect(() => {
		setFirstDayOfMonth(new Date(year, month, 1));
		setDaysInMonth(new Date(year, month + 1, 0).getUTCDate());
	}, [year, month]);

	useEffect(() => {
		const dateStr = firstDayOfMonth.toLocaleDateString("en-us", {
			weekday: "long",
			year: "numeric",
			month: "numeric",
			day: "numeric"
		});
		setDateString(dateStr);
	}, [firstDayOfMonth]);

	useEffect(() => {
		setPaddingDays(weekDays.indexOf(dateString.split(", ")[0]));
		//setLoading(false);
	}, [dateString]);

	useEffect(() => {
		const day = dateObj.getDate();
		const dayOfWeek = dateObj.getDay();
		const start = day - dayOfWeek + paddingDays - 1;
		setRowDays(Array.from({ length: 7 }, (_, i) => start + i));
		setTimeout(() => {
			setLoading(false);
		}, 0);
	}, [paddingDays, dateObj]);

	useEffect(() => {
		const currentDay = weekDateObj.getDay();
		const startOfWeek = new Date(weekDateObj);
		startOfWeek.setDate(weekDateObj.getDate() - currentDay + 7 * weekOffset);
		const week = Array.from({ length: 7 }, (_, i) => {
			const day = new Date(startOfWeek);
			day.setDate(startOfWeek.getDate() + i);
			return day;
		});
		setCurrentWeek(week);
	}, [weekDateObj, weekOffset]);

	return (
		<DatesContext.Provider
			value={{
				dt,
				loading,
				paddingDays,
				daysInMonth,
				month,
				year,
				day,
				string,
				nav,
				openModal,
				theDay,
				currentWeek,
				secondString,
				setWeekOffset,
				setSecondString,
				setNav,
				setCurrentWeek,
				setTheDay,
				setOpenModal,
				setString,
				setDt,
				setUpdatedDate,
				finish,
				setDay,
				setMonth,
				setYear,
				dateString,
				rowDays,
				dateObj
			}}
		>
			{children}
		</DatesContext.Provider>
	);
};

export default DatesContext;
