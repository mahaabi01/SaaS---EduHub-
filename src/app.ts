import express from "express";

const app = express();

import authRoute from "./route/globals/auth/auth.route";
import instituteRoute from "./route/institute/instituteRoute"
import courseRoute from "./route/institute/course/courseRoute"
import studentRoute from "./route/institute/student/studentRoute"


app.use(express.json());
app.use("/api", authRoute);
app.use("/api/institute", instituteRoute)
app.use("/api/institute/course", courseRoute)
app.use("/api/institute/student", studentRoute)

export default app;