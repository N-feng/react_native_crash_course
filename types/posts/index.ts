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