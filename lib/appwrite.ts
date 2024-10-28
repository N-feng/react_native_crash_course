import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";

import { appwriteConfig } from './appwriteConfig';

export type PostItem = {
    title: string;
    thumbnail: string;
    video: string;
    prompt: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: any[];
    $databaseId: string;
    $collectionId: string;
    creator: Creator;
};

export interface Creator {
  username: string;
  email: string;
  avatar: string;
  accountId: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform)
;

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Register user
export async function createUser({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    console.log("newAccount", newAccount);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      },
    );

    console.log("newUser", newUser);

    await signIn({ email, password });

    return newUser;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Sign In
export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    // await account.deleteSession("current");
    const session = await account.createEmailPasswordSession(email, password);
    console.log("session", session);
    return session;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Get Account
// export async function getAccount() {
//   try {
//     console.log("account", account);
//     const currentAccount = await account.get();
//     console.log("currentAccount", currentAccount);
//     return currentAccount;
//   } catch (error) {
//     // @ts-ignore
//     throw new Error(error);
//   }
// }

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile({ file, type }: { file: any; type: string }) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset,
    );

    const fileUrl = await getFilePreview({ fileId: uploadedFile.$id, type });
    return fileUrl;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview({
  fileId,
  type,
}: {
  fileId: string;
  type: string;
}) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        // @ts-ignore
        "top",
        100,
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form: any) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile({ file: form.thumbnail, type: "image" }),
      uploadFile({ file: form.video, type: "video" }),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      },
    );

    return newPost;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
    );

    return posts.documents as PostItem[];
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)],
    );

    return posts.documents;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)],
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)],
    );

    return posts.documents;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}