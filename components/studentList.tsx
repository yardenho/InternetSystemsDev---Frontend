import { FC, useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Button,
    Alert,
    TextInput,
    FlatList,
    TouchableHighlight,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import studentModel, { Student } from "../Model/student_model";

const ListItem: FC<{
    name: String;
    id: String;
    image: String;
    onRowSelected: (id: String) => void;
}> = ({ name, id, image, onRowSelected }) => {
    const onClick = () => {
        console.log("in the row: row was selected " + id);
        onRowSelected(id);
    };
    return (
        <TouchableHighlight onPress={onClick} underlayColor={"gainsboro"}>
            <View style={styles.listRow}>
                {image == "url" && (
                    <Image
                        style={styles.listRowImage}
                        source={require("../assets/avatar.png")}
                    />
                )}
                {image != "url" && (
                    <Image
                        style={styles.listRowImage}
                        source={{ uri: image.toString() }}
                    />
                )}

                <View style={styles.listRowTextContainer}>
                    <Text style={styles.listRowName}>{name}</Text>
                    <Text style={styles.listRowId}>{id}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const StudentList: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const onRowSelected = (id: String) => {
        console.log("in the list: row was selected id = " + id);
        navigation.navigate("StudentDetails", { studentId: id });
    };

    const [students, setStudents] = useState<Array<Student>>();

    const fetchStudents = async () => {
        console.log("focus");
        let students: Student[] = [];
        try {
            students = await studentModel.getAllStudents();
        } catch (err) {
            console.log("fail fetching students " + err);
        }
        setStudents(students);
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            await fetchStudents();
        });
        return unsubscribe;
    }, []);

    return (
        <FlatList
            style={styles.flatlist}
            data={students}
            keyExtractor={(student) => student.id.toString()}
            renderItem={({ item }) => (
                <ListItem
                    name={item.name}
                    id={item.id}
                    image={item.image}
                    onRowSelected={onRowSelected}
                />
            )}
        ></FlatList>
    );
};

const styles = StyleSheet.create({
    listRow: {
        margin: 4,
        flexDirection: "row",
        height: 150,
        elevation: 1,
        borderRadius: 2,
    },
    listRowImage: {
        margin: 10,
        resizeMode: "contain",
        height: 130,
        width: 130,
    },
    listRowTextContainer: {
        flex: 1,
        margin: 10,
        justifyContent: "space-around",
    },
    listRowName: {
        fontSize: 30,
    },
    listRowId: {
        fontSize: 25,
    },
    flatlist: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
});

export default StudentList;
