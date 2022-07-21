import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayRemove,
} from 'firebase/firestore';
import { firebaseDB } from './firebase';

// collection(db, 'collectionPath') 가 접근하고자 하는 db 와 컬렉션의 주소를 가짐
// REST API 를 기준으로 하자면, URI 의 역할을 하는 것.

const DBHandler = {
  async writePost(
    ref: string,
    data: { nickname: string; content: string; userId: string }
  ) {
    await setDoc(doc(collection(firebaseDB, ref)), {
      nickname: data.nickname,
      content: data.content,
      userId: data.userId,
      timestamp: serverTimestamp(),
      comments: [],
    });
  },

  async deletePost(id: string) {
    deleteDoc(doc(firebaseDB, `posts/${id}`));
  },

  async writeComment(id: string, data: { comment: string; userId: string }) {
    await updateDoc(doc(firebaseDB, `posts/${id}`), {
      comments: arrayUnion({ content: data.comment, userId: data.userId }),
    });
  },

  async deleteComment(id: string, data: { comment: string; userId: string }) {
    await updateDoc(doc(firebaseDB, `posts/${id}`), {
      comments: arrayRemove({ content: data.comment, userId: data.userId }),
    });
  },
};

export default DBHandler;
