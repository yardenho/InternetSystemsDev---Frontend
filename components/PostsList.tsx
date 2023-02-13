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
import postModel, { Post } from "../Model/post_model";

const ListItem: FC<{
    name: String;
    description: String;
    image: String;
}> = ({ name, description, image }) => {
    return (
        <TouchableHighlight underlayColor={"gainsboro"}>
            <View style={styles.listRow1}>
                <View style={styles.listRow}>
                    {image == "url" && (
                        <Image
                            style={styles.userImage}
                            source={require("../assets/avatar.png")}
                        />
                    )}
                    {image != "url" && (
                        <Image
                            style={styles.userImage}
                            source={{ uri: image.toString() }}
                        />
                    )}
                    <Text style={styles.userName}>{name}</Text>
                </View>
                <View style={styles.listRowTextContainer}>
                    <Image
                        style={styles.postImage}
                        source={require("../assets/avatar.png")}
                    />
                    <Text style={styles.postContext}>{description}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const PostsList: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const onRowSelected = (id: String) => {
        console.log("in the list: row was selected id = " + id);
        navigation.navigate("StudentDetails", { studentId: id });
    };

    const [posts, setPosts] = useState<Array<Post>>();

    const fetchPosts = async () => {
        console.log("focus");
        let posts: Post[] = [];
        try {
            posts = await postModel.getAllPosts();
        } catch (err) {
            console.log("fail fetching posts " + err);
        }
        setPosts(posts);
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            await fetchPosts();
        });
        return unsubscribe;
    }, []);

    return (
        <FlatList
            style={styles.flatlist}
            data={posts}
            keyExtractor={(post) => post.postId.toString()}
            renderItem={({ item }) => (
                <ListItem
                    name={item.username}
                    description={item.description}
                    image={item.image}
                />
            )}
        ></FlatList>
    );
};

const styles = StyleSheet.create({
    listRow1: {
        margin: 4,
        flex: 1,
        elevation: 1,
        borderRadius: 2,
    },
    listRow: {
        flexDirection: "row",
    },
    userImage: {
        margin: 10,
        resizeMode: "contain",
        height: 50,
        width: 50,
        borderRadius: 30,
    },
    postImage: {
        height: 130,
        width: 130,
        alignSelf: "center",
    },
    listRowTextContainer: {
        flex: 1,
        justifyContent: "space-around",
    },
    userName: {
        fontSize: 25,
        marginTop: 10,
    },
    postContext: {
        fontSize: 20,
        margin: 4,
    },
    flatlist: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
});

export default PostsList;
