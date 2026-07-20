import { useState } from "react";

const QueueFilter = ({ onFilter }) => {
    const [search, setSearch] = useState("");
    return (
        <div
            style={{
                display: "flex",
                gap: "12px",
                padding: "20px",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                marginBottom: "20px",
            }}
        >
            <select
                style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                }}
                onChange={(e) =>
                    onFilter({
                        status: e.target.value,
                    })
                }
            >
                <option value="">
                    All Status
                </option>

                <option value="waiting">
                    Waiting
                </option>

                <option value="serving">
                    Serving
                </option>

                <option value="done">
                    Done
                </option>

                <option value="cancelled">
                    Cancelled
                </option>
            </select>


            <input
                type="text"
                placeholder="Search queue number..."
                style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    outline: "none",
                }}
                onChange={(e) =>{
                    setSearch(e.target.value)
                    onFilter({
                        search: e.target.value,
                    });
                }}
            />
            <button
                style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#1677ff",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                }}
                onClick={() =>{
                    setSearch("");
                    onFilter({})
                }}
            >
                Reset
            </button>
        </div>
    );
};

export default QueueFilter;