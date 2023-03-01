import { FC, useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableHighlight,
    ActivityIndicator,
} from "react-native";
import React from "react";
import postModel, { Post } from "../Model/post_model";

const ListItem: FC<{
    name: String;
    description: String;
    image: String;
    userImage: String;
}> = ({ name, description, image, userImage }) => {
    return (
        <TouchableHighlight underlayColor={"gainsboro"}>
            <View style={styles.listRow1}>
                <View style={styles.listRow}>
                    {userImage == "url" && (
                        <Image
                            style={styles.userImage}
                            source={require("../assets/avatar.png")}
                        />
                    )}
                    {userImage != "url" && (
                        <Image
                            style={styles.userImage}
                            source={{ uri: userImage.toString() }}
                        />
                    )}

                    <Text style={styles.userName}>{name}</Text>
                </View>
                <View style={styles.listRowTextContainer}>
                    {image == "url" && (
                        <Image
                            style={styles.postImage}
                            source={require("../assets/avatar.png")}
                        />
                    )}
                    {image != "url" && (
                        <Image
                            style={styles.postImage}
                            source={{ uri: image.toString() }}
                        />
                    )}
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
    const [posts, setPosts] = useState<Array<Post>>();
    const [proccess, setProccess] = useState(false);

    const fetchPosts = async () => {
        let posts: Post[] = [];
        try {
            posts = await postModel.getAllPosts();
        } catch (err) {
            console.log("fail fetching posts " + err);
        }
        setPosts(posts);
        setProccess(false);
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            setProccess(true);
            setPosts([]);
            await fetchPosts();
        });
        return unsubscribe;
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatlist}
                data={posts}
                keyExtractor={(post) => post.postId.toString()}
                renderItem={({ item }) => (
                    <ListItem
                        name={item.username}
                        description={item.message}
                        image={item.image}
                        userImage={item.userImage}
                    />
                )}
            ></FlatList>
            <ActivityIndicator
                size={180}
                color="#5c9665"
                animating={proccess}
                style={{
                    position: "absolute",
                    marginTop: 130,
                    marginLeft: 130,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        height: 300,
        width: 300,
        alignSelf: "center",
    },
    listRowTextContainer: {
        flex: 1,
        justifyContent: "space-around",
    },
    userName: {
        fontSize: 21,
        fontWeight: "bold",
        marginTop: 17,
    },
    postContext: {
        fontSize: 22,
        margin: 10,
    },
    flatlist: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
});

export default PostsList;
