import { useRef, useState } from "react";
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  SeeMore,
  PortalWrapper
} from "./Custom";
import Draggable from 'react-draggable';
import "./Calendar.css";

export const Calendar = ({onClose}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 7, 1));
  const dragDateRef = useRef();
  const dragindexRef = useRef();
  const [showPortal, setShowPortal] = useState(false);
  const [portalData, setPortalData] = useState({});
  const [position, setPosition] = useState({ x: 400, y: 100 });

  const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

  const MOCKAPPS = [
    { date: new Date(2023, 7, 14), title: "Quiz", color: "#238783" },
  ];


  const [events, setEvents] = useState(MOCKAPPS);

  const addEvent = (date, event) => {
    if (!event.target.classList.contains("StyledEvent")) {
      const text = window.prompt("name");
      if (text) {
        date.setHours(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        setEvents((prev) => [
          ...prev,
          { date, title: text, color: getDarkColor() }
        ]);
      }
    }
  };

  const drag = (index, e) => {
    dragindexRef.current = { index, target: e.target };
  };

  const onDragEnter = (date, e) => {
    e.preventDefault();
    dragDateRef.current = { date, target: e.target.id };
  };

  const drop = (ev) => {
    ev.preventDefault();

    setEvents((prev) =>
      prev.map((ev, index) => {
        if (index === dragindexRef.current.index) {
          ev.date = dragDateRef.current.date;
        }
        return ev;
      })
    );
  };

  const handleOnClickEvent = (event) => {
    setShowPortal(true);
    setPortalData(event);
  };

  const handlePotalClose = () => setShowPortal(false);

  const handleDelete = () => {
    setEvents((prevEvents) =>
      prevEvents.filter((ev) => ev.title !== portalData.title)
    );
    handlePotalClose();
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const range = (end) => {
    const { result } = Array.from({ length: end }).reduce(
        ({ result, current }) => ({
        result: [...result, current],
        current: current + 1
        }),
        { result: [], current: 1 }
    );
    return result;
  };

  const sortDays = (date) => {
    const dayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const sortedDays = [...DAYS.slice(dayIndex), ...DAYS.slice(0, dayIndex)];
    return sortedDays;
  };

  const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

    const getMonthYear = (date) => {
    const d = date.toDateString().split(" ");
    return `${d[1]} ${d[3]}`;
  };

  const nextMonth = (date, cb) => {
    const mon = date.getMonth();
    if (mon < 11) {
        date.setMonth(mon + 1);
    } else {
        date.setMonth(0);
        date.setFullYear(date.getFullYear() + 1);
    }
    cb(new Date(date));
  };

  const prevMonth = (date, cb) => {
    const mon = date.getMonth();
    if (mon > 0) {
        date.setMonth(mon - 1);
    } else {
        date.setMonth(11);
        date.setFullYear(date.getFullYear() - 1);
    }
    cb(new Date(date));
  };

  const getDarkColor = () => {
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
  };

  const getSortedDays = (date) => {
    const daysInMonth = range(getDaysInMonth(date));
    const index = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return [...Array(index === 0 ? 6 : index - 1), ...daysInMonth];
  };


  const handleDrag = (e, ui) => {
    const { x, y } = position;
    const { width, height } = position;
    const innerWidth = document.documentElement.clientWidth - 100;
    const innerHeight = document.documentElement.clientHeight - 100;

    const newPosition = {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
    };

    setPosition(newPosition);

    if (
        newPosition.x - width - 500 < -innerWidth ||
        newPosition.x > innerWidth ||
        newPosition.y - height - 280 < -innerHeight ||
        newPosition.y > innerHeight
    ) {
        handleClose();
    }
    };

    const handleClose = () => {
    if (onClose) {
        onClose();
    }
    };


  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      handle=".CalHandle"
    >
      <div className="CalMain">
        <div className="CalHandle">
            <div className="CalHandle-content">Calendar</div>
            <button className="close-button" onClick={handleClose}>
                -
            </button>
        </div>
        <Wrapper>
          <DateControls>
            <ion-icon
              onClick={() => prevMonth(currentDate, setCurrentDate)}
              name="arrow-back-circle-outline"
            ></ion-icon>
            {getMonthYear(currentDate)}
            <ion-icon
              onClick={() => nextMonth(currentDate, setCurrentDate)}
              name="arrow-forward-circle-outline"
            ></ion-icon>
          </DateControls>
          <SevenColGrid >
            {DAYS.map((day) => (
              <HeadDays className="nonDRAG">{day}</HeadDays>
            ))}
          </SevenColGrid>

          <SevenColGrid
            fullheight={true}
            is28Days={getDaysInMonth(currentDate) === 28}
          >
            {getSortedDays(currentDate).map((day) => (
              <div
                id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
                onDragEnter={(e) =>
                  onDragEnter(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    ),
                    e
                  )
                }
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={drop}
                onClick={(e) =>
                  addEvent(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    ),
                    e
                  )
                }
              >
                <span
                  className={`nonDRAG ${
                    datesAreOnSameDay(
                      new Date(),
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  {day}
                </span>
                <EventWrapper>
                  {events.map(
                    (ev, index) =>
                      datesAreOnSameDay(
                        ev.date,
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        )
                      ) && (
                        <StyledEvent
                          onDragStart={(e) => drag(index, e)}
                          onClick={() => handleOnClickEvent(ev)}
                          draggable
                          className="StyledEvent"
                          id={`${ev.color} ${ev.title}`}
                          key={ev.title}
                          bgColor={ev.color}
                        >
                          {ev.title}
                        </StyledEvent>
                      )
                  )}
                </EventWrapper>
              </div>
            ))}
          </SevenColGrid>
          {showPortal && (
            <Portal
              {...portalData}
              handleDelete={handleDelete}
              handlePotalClose={handlePotalClose}
            />
          )}
        </Wrapper>

      </div>
    </Draggable>
  );
};

const EventWrapper = ({ children }) => {
  if (children.filter((child) => child).length)
    return (
      <>
        {children}
        {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked p");
            }}
          >
            see more...
          </SeeMore>
        )}
      </>
    );
};

const Portal = ({ title, date, handleDelete, handlePotalClose }) => {
  return (
    <PortalWrapper>
      <h2>{title}</h2>
      <p>{date.toDateString()}</p>
      <ion-icon onClick={handleDelete} name="trash-outline"></ion-icon>
      <ion-icon onClick={handlePotalClose} name="close-outline"></ion-icon>
    </PortalWrapper>
  );
};

export default Calendar;