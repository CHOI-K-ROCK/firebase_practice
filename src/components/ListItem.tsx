/* eslint-disable react/no-array-index-key */
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DBHandler from '../firebase/DBHandler';
import { firebaseDB } from '../firebase/firebase';

const Container = styled.section`
  position: relative;
  border: 2px solid #fff;
  width: min(400px, 100%);
  height: max-content;
  padding: 20px;
  background-color: #fff;

  box-sizing: border-box;
  border-radius: 10px;

  margin-bottom: 10px;

  .del_btn {
    position: absolute;
    top: 15px;
    right: 15px;

    background: none;
    border: none;

    color: #777;

    cursor: pointer;

    &:hover {
      color: #4580ff;
    }
  }

  .nickname {
    font-size: 1.2rem;

    &::after {
      content: '님의 주저리';
      font-size: 0.9rem;
      margin-left: 5px;
      color: #777;
    }
  }

  .content {
    margin: 10px 0;

    border-left: 2px solid #4580ff;
    padding-left: 5px;
    padding-top: 2px;

    margin-bottom: 20px;
  }

  .comment_wrapper {
    .title {
      color: #777;
      font-size: 0.9rem;
      margin-bottom: 5px;
    }

    .comment {
      position: relative;
      display: flex;

      padding: 7px;
      padding-right: 30px;
      background-color: #4580ff;

      color: white;

      margin-bottom: 10px;
      border-radius: 5px;

      &::after {
        content: '';
        position: absolute;
        right: 10px;
        bottom: -3px;

        display: block;

        height: 10px;
        width: 10px;

        background-color: #4580ff;

        transform: rotate(40deg);
      }
    }
    .comment_del_btn {
      position: absolute;
      right: 0;
      width: 40px;
      background: none;
      border: none;
      color: #fff;

      z-index: 2;
    }
  }

  .input_wrapper {
    position: relative;
    display: flex;
    width: 100%;

    margin-top: 20px;

    input {
      flex: 4;

      width: 100%;
      height: 1.5rem;
      box-sizing: border-box;

      padding-right: 55px;

      border: none;
      border-bottom: 2px solid #99b9ff;

      font-size: 1rem;

      &:focus {
        outline: none;
      }
    }

    button {
      flex: 1;

      width: 50px;
      height: 1.5rem;

      right: 0;

      border: none;
      background-color: #4580ff;

      color: white;

      border-radius: 5px 0 5px 0;

      font-size: 1rem;

      cursor: pointer;
    }
  }
`;

interface IProps {
  nickname?: string;
  content?: string;
  userId: string;
  id: string;
  comments: any[];
}

function ListItem({
  nickname,
  content,
  id,
  userId,
  comments,
}: IProps): JSX.Element {
  const [commentValue, setCommentValue] = useState<string>('');

  function deletePost() {
    DBHandler.deletePost(id);
  }

  function uploadComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      comment: commentValue,
      userId: window.localStorage.getItem('userId') as string,
    };
    DBHandler.writeComment(id, data);
    setCommentValue('');
  }

  function deleteComment(curComment: string) {
    const data = {
      comment: curComment,
      userId: window.localStorage.getItem('userId') as string,
    };
    DBHandler.deleteComment(id, data);
  }

  return (
    <Container>
      {userId === window.localStorage.getItem('userId') && (
        <button type="button" className="del_btn" onClick={() => deletePost()}>
          삭제하기
        </button>
      )}
      <h3 className="nickname">{nickname}</h3>
      <p className="content">{content}</p>
      <div className="comment_wrapper">
        <div className="title">
          {comments?.length
            ? `${comments.length}개의 댓글`
            : '댓글이 없습니다.'}
        </div>
        {comments.map((comment, idx) => {
          return (
            <div key={idx} className="comment">
              {comment.content}
              {window.localStorage.getItem('userId') === comment.userId ? (
                <button
                  className="comment_del_btn"
                  type="button"
                  onClick={() => deleteComment(comment.content)}
                >
                  삭제
                </button>
              ) : null}
            </div>
          );
        })}
        <form className="input_wrapper" onSubmit={(e) => uploadComment(e)}>
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
          />
          <button type="submit">확인</button>
        </form>
      </div>
    </Container>
  );
}

ListItem.defaultProps = {
  nickname: '기본 닉네임',
  content: '기본 내용',
};

export default ListItem;
