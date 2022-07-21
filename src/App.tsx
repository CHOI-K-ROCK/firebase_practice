/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import { v4 as uuidv4 } from 'uuid';

import { collection, onSnapshot } from 'firebase/firestore';
import DBHandler from './firebase/DBHandler';
import ListItem from './components/ListItem';
import { firebaseDB } from './firebase/firebase';

const GlobalStyles = createGlobalStyle`
    ${reset}

    body {
      background-color: #000;
    }

    a {
      color: #000;
    }

    button {
      color: #000;
    }
  `;

const Container = styled.section`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  .service_title {
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 10px 0;
    margin-bottom: 10px;

    font-size: 2rem;
    color: #fff;

    background-color: #000;
    z-index: 1;
  }

  & > form {
    width: min(400px, 90%);
    display: flex;
    gap: 10px;
    justify-content: space-between;

    margin-bottom: 20px;

    * {
      box-sizing: border-box;
    }

    .input_wrapper {
      flex: 8;

      input {
        width: 100%;
        height: 2.5rem;
        margin-bottom: 10px;
        border: none;
        border-radius: 5px;

        &:last-of-type {
          margin-bottom: 0;
        }

        &:focus {
          outline: 3px solid #4580ff;
        }
      }
    }

    .add_post_button {
      flex: 2;

      height: 100%;

      border: none;
      border-radius: 10px;
      background-color: #4580ff;

      font-size: 1rem;
      color: #fff;

      cursor: pointer;

      &.disabled {
        background-color: #555;
        color: #aaa;

        cursor: default;
      }
    }
  }

  .list_wrapper {
    width: 90vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    gap: 20px;

    height: max-content;
    min-height: 300px;
  }

  @media screen and (max-width: 500px) {
    justify-content: flex-start;

    & > form {
      position: fixed;
      bottom: 0;
      width: 90%;
      height: 90px;
      margin-bottom: 0;

      background-color: #000;
      padding: 20px 30px;

      z-index: 1;

      .add_post_button {
        height: 100%;
      }
    }

    .list_wrapper {
      margin-top: calc(2rem + 30px);
      gap: 0;
      min-height: 0;
    }
  }
`;

function App(): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const userId = window.localStorage.getItem('userId');
    if (!userId) {
      window.localStorage.setItem('userId', uuidv4());
    }
  }, []);

  useEffect(() => {
    onSnapshot(collection(firebaseDB, 'posts'), (snapshot) => {
      const postsArr = snapshot.docs.map((eachDoc) => {
        return Object.assign(eachDoc.data(), { id: eachDoc.id });
      });
      const sortedArr = postsArr.sort((a: any, b: any) => {
        return b.timestamp - a.timestamp;
      });

      setPosts(sortedArr);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function uploadToCF() {
    const data = {
      nickname,
      content,
      userId: window.localStorage.getItem('userId') as string,
    };
    DBHandler.writePost('posts', data);
  }

  function uploadBtnHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    uploadToCF();
    setNickname('');
    setContent('');
  }

  return (
    <>
      <GlobalStyles />
      <Container>
        <h1 className="service_title">JUJUL</h1>
        <form onSubmit={(e) => uploadBtnHandler(e)}>
          <div className="input_wrapper">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <input
              type="text"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          {nickname.length && content.length ? (
            <button className="add_post_button" type="submit">
              upload
            </button>
          ) : (
            <button disabled className="add_post_button disabled" type="submit">
              upload
            </button>
          )}
        </form>
        <div className="list_wrapper">
          {posts.map((post, idx) => {
            return (
              <ListItem
                key={idx}
                id={post.id}
                userId={post.userId}
                nickname={post.nickname}
                content={post.content}
                comments={post.comments}
              />
            );
          })}
        </div>
      </Container>
    </>
  );
}

export default App;
