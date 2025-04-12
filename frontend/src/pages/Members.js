import React, { useState, useEffect } from "react";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    department: "",
    experience: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/members");
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        console.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewMember({ ...newMember, [id]: value });
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        // Update existing member
        const response = await fetch(
          `http://localhost:8080/api/members/${editingMember.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMember),
          }
        );
        if (response.ok) {
          const updatedMember = await response.json();
          setMembers(
            members.map((m) => (m.id === updatedMember.id ? updatedMember : m))
          );
        } else {
          alert("Failed to update member");
        }
      } else {
        // Add new member
        const response = await fetch("http://localhost:8080/api/members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMember),
        });
        if (response.ok) {
          const createdMember = await response.json();
          setMembers([...members, createdMember]);
        } else {
          alert("Failed to add member");
        }
      }
      setNewMember({ name: "", department: "", experience: "" });
      setShowModal(false);
      setEditingMember(null);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  // Handle deleting a member
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/members/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMembers(members.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("An error occurred");
    }
  };

  // Handle editing a member
  const handleEdit = (member) => {
    setEditingMember(member);
    setNewMember({ ...member });
    setShowModal(true);
  };

  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setNewMember({ name: "", department: "", experience: "" });
        setEditingMember(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div>
      <div className="container">
        <h1>Members</h1>
        <h2>Registered Users</h2>
        <div className="task-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.department}</td>
                  <td>{member.experience}</td>
                  <td>
                    <button
                      className="btned"
                      onClick={() => handleEdit(member)}
                    >
                      <i className="fas fa-pen"></i>
                    </button>
                    <button
                      className="btndel"
                      onClick={() => handleDelete(member.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px" }}>
          <button className="btn" onClick={() => setShowModal(true)}>
            Add User
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingMember ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={newMember.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="department"
                placeholder="Department"
                value={newMember.department}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="experience"
                placeholder="Experience (e.g., 3 Year)"
                value={newMember.experience}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="btnsave">
                {editingMember ? "Save Changes" : "Add"}
              </button>
              <button
                type="button"
                className="btncls"
                onClick={() => {
                  setShowModal(false);
                  setNewMember({ name: "", department: "", experience: "" });
                  setEditingMember(null);
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
