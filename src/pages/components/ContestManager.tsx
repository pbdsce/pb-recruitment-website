import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Contest {
  id: string;
  name: string;
  registrationStartTime: number;
  registrationEndTime: number;
  startTime: number;
  endTime: number;
  eligibleTo: string;
}

type RegistrationStatus = "upcoming" | "open" | "closed";
type RunningStatus = "upcoming" | "open" | "closed";

interface ContestManagerProps {
  contests: Contest[];
  setContests: (contests: Contest[]) => void;
}

const ContestManager: React.FC<ContestManagerProps> = ({ contests, setContests }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [formData, setFormData] = useState<Contest>({
    id: "",
    name: "",
    registrationStartTime: 0,
    registrationEndTime: 0,
    startTime: 0,
    endTime: 0,
    eligibleTo: "",
  });

  const getRegistrationStatus = (contest: Contest): RegistrationStatus => {
    const now = Math.floor(Date.now() / 1000);
    if (contest.registrationStartTime > now) return "upcoming";
    if (contest.registrationStartTime <= now && contest.registrationEndTime >= now) return "open";
    return "closed";
  };

  const getRunningStatus = (contest: Contest): RunningStatus => {
    const now = Math.floor(Date.now() / 1000);
    if (contest.startTime > now) return "upcoming";
    if (contest.startTime <= now && contest.endTime >= now) return "open";
    return "closed";
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const dateToTimestamp = (dateString: string): number => {
    return Math.floor(new Date(dateString).getTime() / 1000);
  };

  const timestampToDateInput = (timestamp: number): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toISOString().slice(0, 16);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContest) {
      setContests(contests.map((c) => (c.id === editingContest.id ? formData : c)));
    } else {
      setContests([...contests, formData]);
    }
    resetForm();
  };

  const handleEdit = (contest: Contest) => {
    setEditingContest(contest);
    setFormData(contest);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      setContests(contests.filter((c) => c.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      registrationStartTime: 0,
      registrationEndTime: 0,
      startTime: 0,
      endTime: 0,
      eligibleTo: "",
    });
    setEditingContest(null);
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-green-400";
      case "upcoming":
        return "text-blue-400";
      case "closed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-green-400">Contest Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/50"
        >
           Create Contest
        </button>
      </div>

      <div className="grid gap-4">
        {contests.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-gray-400">No contests created yet. Click "Add Contest" to create one.</p>
          </div>
        ) : (
          contests.map((contest) => {
            const regStatus = getRegistrationStatus(contest);
            const runStatus = getRunningStatus(contest);
            return (
              <div
                key={contest.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 hover:border-green-500 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg md:text-xl font-bold text-green-400 break-words">{contest.name}</h3>
                      <span className="text-sm text-gray-400 truncate">({contest.eligibleTo})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Registration:</span>
                        <span className={`ml-2 font-semibold ${getStatusColor(regStatus)}`}>
                          {regStatus.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Contest:</span>
                        <span className={`ml-2 font-semibold ${getStatusColor(runStatus)}`}>
                          {runStatus.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Contest ID:</span>
                        <span className="text-gray-300 ml-2">{contest.id}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-gray-800 p-4 rounded">
                      <div>
                        <p className="text-gray-500">Registration Start:</p>
                        <p className="text-gray-300">{formatTimestamp(contest.registrationStartTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Registration End:</p>
                        <p className="text-gray-300">{formatTimestamp(contest.registrationEndTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contest Start:</p>
                        <p className="text-gray-300">{formatTimestamp(contest.startTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contest End:</p>
                        <p className="text-gray-300">{formatTimestamp(contest.endTime)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:ml-4 w-full md:w-auto mt-2 md:mt-0">
                    <button
                      onClick={() => handleEdit(contest)}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contest.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors font-semibold"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/admin/contest/${contest.id}/problems`)}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors font-semibold"
                    >
                      Manage Problems
                    </button>
                    <button
                      onClick={() => navigate(`/admin/contest/${contest.id}/contestants`)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition-colors font-semibold"
                    >
                      View Contestants
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-green-500">
            <h3 className="text-2xl font-bold text-green-400 mb-6">
              {editingContest ? "Edit Contest" : "Create New Contest"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Contest ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    disabled={!!editingContest}
                    placeholder="first-years"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none disabled:opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Eligible To</label>
                  <input
                    type="text"
                    name="eligibleTo"
                    value={formData.eligibleTo}
                    onChange={handleInputChange}
                    placeholder="1st Year / 2nd & 3rd Year"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Contest Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Registration Start Time</label>
                  <input
                    type="datetime-local"
                    value={timestampToDateInput(formData.registrationStartTime)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        registrationStartTime: dateToTimestamp(e.target.value),
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Registration End Time</label>
                  <input
                    type="datetime-local"
                    value={timestampToDateInput(formData.registrationEndTime)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        registrationEndTime: dateToTimestamp(e.target.value),
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Contest Start Time</label>
                  <input
                    type="datetime-local"
                    value={timestampToDateInput(formData.startTime)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startTime: dateToTimestamp(e.target.value),
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Contest End Time</label>
                  <input
                    type="datetime-local"
                    value={timestampToDateInput(formData.endTime)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endTime: dateToTimestamp(e.target.value),
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/50"
                >
                  {editingContest ? "Update Contest" : "Create Contest"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestManager;