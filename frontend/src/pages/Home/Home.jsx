import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import { MdAdd } from "react-icons/md";
import AddEditTravelStory from "./AddEditTravelStory";
import moment from "moment";
import ViewTravelStory from "./ViewTravelStory";
import { DayPicker } from "react-day-picker";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: null, // "add" or "edit"
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [filterType, setFilterType] = useState("");

  const handleDayClick = (day) => {
    setDateRange(day);
    filiterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllTravelStories();
  };

  const filiterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;
      const token = localStorage.getItem("token");

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: { startDate, endDate },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.error("Error filtering stories by date:", error);
    }
  };

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axiosInstance.get(`/get-user?accssToken=${token}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserInfo(response.data.user);
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axiosInstance.get(`/get-all-stories?accessToken=${token}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    const token = localStorage.getItem("token");

    try {
      const response = await axiosInstance.put(
        `/update-is-favourite/${storyId}`,
        { isFavourite: !storyData.isFavourite },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.story) {
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  };

  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    const token = localStorage.getItem("token");

    try {
      const response = await axiosInstance.delete(`/delete-story/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again later.", error);
    }
  };

  const onSearchStory = async (query) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/search", {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery("");
    resetFilter();
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchStory={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={resetFilter}
        />
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-20">
                <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-blue-500"
    fill="none"
    viewBox="0 0 32 32"
  >
    <g id="pages">
      <path
        fill="#cdf6f9"
        d="M2,7v18c0,2.761,2.239,5,5,5h18c2.761,0,5-2.239,5-5V7c0-2.761-2.239-5-5-5H7C4.239,2,2,4.239,2,7z"
      ></path>
      <path
        fill="#fff"
        d="M20.693,8.945L20.693,8.945c0.932,0.932,0.932,2.443,0,3.375l-7.464,7.464 c-0.125,0.125-0.286,0.208-0.46,0.237l-2.612,0.441c-0.577,0.097-1.078-0.403-0.981-0.981l0.441-2.612 c0.029-0.174,0.112-0.335,0.237-0.46l7.464-7.464C18.25,8.013,19.761,8.013,20.693,8.945z"
      ></path>
      <path
        fill="#1a83a8"
        d="M25,1.1H7C3.747,1.1,1.1,3.747,1.1,7v18c0,3.253,2.646,5.9,5.9,5.9h18c3.253,0,5.9-2.647,5.9-5.9V7 C30.9,3.747,28.253,1.1,25,1.1z M29.1,25c0,2.261-1.839,4.1-4.1,4.1H7c-2.261,0-4.1-1.839-4.1-4.1V7c0-2.261,1.839-4.1,4.1-4.1h18 c2.261,0,4.1,1.839,4.1,4.1V25z"
      ></path>
      <path
        fill="#1a83a8"
        d="M10.016 21.373c.097 0 .194-.008.291-.024l2.612-.44c.362-.061.69-.23.947-.488l7.463-7.464c.621-.62.964-1.446.964-2.323 0-.878-.342-1.703-.963-2.323-1.24-1.242-3.408-1.241-4.647-.001l-7.465 7.465c-.257.258-.425.584-.487.945L8.289 19.33c-.095.558.088 1.13.488 1.53C9.108 21.19 9.556 21.373 10.016 21.373zM19.006 9.146c.396 0 .77.155 1.05.436 0 .001 0 .001.001.001.28.28.436.653.436 1.051 0 .396-.155.77-.437 1.05l-1.002 1.003-2.102-2.102 1.003-1.003C18.235 9.301 18.608 9.146 19.006 9.146zM10.491 17.045l5.188-5.188 2.103 2.103-5.162 5.172-2.556.497L10.491 17.045zM22.836 22.854h-.938c-.497 0-.9.403-.9.9s.403.9.9.9h.938c.497 0 .9-.403.9-.9S23.333 22.854 22.836 22.854zM18.293 22.854H9.366c-.497 0-.9.403-.9.9s.403.9.9.9h8.927c.497 0 .9-.403.9-.9S18.79 22.854 18.293 22.854z"
      ></path>
    </g>
  </svg>

  <p className="text-lg font-medium text-gray-700 mt-4 text-center">
    {filterType === "search" &&
      "Start creating your first Travel Story! Click the 'Add' button to jot down your thoughts, ideas, and memories. Let's get started!"}
    {filterType === "date" &&
      "No travel stories found for the selected date range. Try adjusting the filter or add a new story to start your travel journal!"}
    {!filterType &&
      "No travel stories to display. Create a story by clicking the add button!"}
  </p>
              </div>
            )}
          </div>
          <div className="w-[340px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-4">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {
          setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
}

export default Home;
