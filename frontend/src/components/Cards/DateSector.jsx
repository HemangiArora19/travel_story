// import React from 'react';
// import moment from 'moment';
// import { MdOutlineDateRange } from 'react-icons/md';

// const DateSector = ({ date, setDate, setOpenDatePicker }) => {
//   return (
//     <div>
//       <button
//         className="inline-fex item-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer"
//         onClick={() => {
//           setOpenDatePicker(true);
//         }}
//       >
//         <MdOutlineDateRange className="text-lg" />
       
//           {date
//             ? moment(date).format('Do MMM YYYY')
//             : moment().format('Do MMM YYYY')}
        
//       </button>
//     </div>
//   );
// };

// export default DateSector;

import moment from 'moment';
import { MdClose, MdOutlineDateRange } from 'react-icons/md';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useState } from 'react';

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date || new Date());

  return (
    <div className="flex flex-col items-start">
      {/* Date Button */}
      <button
        className="flex items-center space-x-2 gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-3 py-2 cursor-pointer"
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-xl" />
        <span className="font-medium">
          {selectedDate
            ? moment(selectedDate).format('Do MMM YYYY')
            : moment().format('Do MMM YYYY')}
        </span>
      </button>

      {/* Calendar Popup */}
      {openDatePicker && (
        <div className="relative bg-sky-50/80 rounded-lg shadow-lg p-5 w-full max-w-md">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-200"
            onClick={() => setOpenDatePicker(false)}
          >
            <MdClose className="text-xl text-sky-600" />
          </button>

          {/* Calendar */}
          <DayPicker
            captionLayout="dropdown-buttons"
            mode="single"
            selected={selectedDate}
            onSelect={(day) => {
              setSelectedDate(day);
              setDate(day); // Update the parent state
              setOpenDatePicker(false); // Close after selection
            }}
            pagedNavigation
            styles={{
              root: {
                '--rdp-accent-color': '#01b0cb',
                '--rdp-accent-background-color': '#dffbff',
                '--rdp-day_button-border-radius': '8px',
                '--rdp-selected-font': 'bold medium var(--rdp-font-family)',
              },
              day_selected: {
                backgroundColor: '#dffbff',
                color: '#01b0cb',
                fontWeight: 'bold',
                borderRadius: '8px',
              },
              day: {
                borderRadius: '8px',
                transition: 'background 0.2s',
              },
              day_hovered: {
                backgroundColor: 'rgba(1, 176, 203, 0.2)',
              },
            }}
            className="lg:ml-4 lg:sticky lg:top-20 w-full max-w-md"
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;


