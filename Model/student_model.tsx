import StudentApi from "../api/StudentApi";
import studentApi from "../api/StudentApi";
import FormData from "form-data";

export type Student = {
    id: String;
    name: String;
    image: String;
};

const getAllStudents = async () => {
    console.log("getAllStudents()");
    const res: any = await studentApi.getAllStudents();
    let students = Array<Student>();
    if (res.data) {
        res.data.forEach((obj: any) => {
            console.log("element: " + obj._id);
            const st: Student = {
                id: obj._id,
                name: obj.name,
                image: obj.avatarUrl,
            };
            students.push(st);
        });
    }
    return students;
};
const addStudent = async (student: Student) => {
    const data = {
        _id: student.id,
        name: student.name,
        avatarUrl: student.image,
    };
    try {
        const res = await StudentApi.addStudent(data);
    } catch (err) {
        console.log("add student fail " + err);
    }
};

const uploadImage = async (imageURI: String) => {
    var body = new FormData();
    body.append("file", {
        name: "name",
        type: "image/jpeg",
        uri: imageURI,
    });
    try {
        const res = await studentApi.uploadImage(body);
        if (!res.ok) {
            console.log("save failed " + res.problem);
            return "url";
        } else {
            if (res.data) {
                const d: any = res.data;
                console.log("url: " + d.url);
                return d.url;
            }
        }
    } catch (err) {
        console.log("save failed " + err);
    }
    return "";
};

export default { getAllStudents, addStudent, uploadImage };
