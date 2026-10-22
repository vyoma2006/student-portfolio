import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Heavy third-party component (recharts). Loaded lazily from Tasks.jsx,
// so it is only downloaded when the user clicks "Show stats".
function TaskChart({ tasks }) {
    const data = ["low", "medium", "high"].map((priority) => {
        const ofPriority = tasks.filter((t) => t.priority === priority);
        return {
            name: priority[0].toUpperCase() + priority.slice(1),
            Pending: ofPriority.filter((t) => !t.completed).length,
            Done: ofPriority.filter((t) => t.completed).length,
        };
    });

    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid var(--card-border)",
                borderRadius: 14,
                padding: "16px 8px 8px",
                marginBottom: 24,
                boxShadow: "var(--shadow)",
            }}
        >
            <p style={{ margin: "0 0 8px 16px", fontWeight: 600, textAlign: "left" }}>
                Tasks by priority
            </p>
            <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Pending" stackId="a" fill="#ff5d73" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Done" stackId="a" fill="#16b3a3" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TaskChart;