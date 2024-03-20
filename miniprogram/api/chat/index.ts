import config from '../../const/config/index';
import request from '../../utils/api';
import { ChatGroup, Message } from './type';

/**
 * 获取对话组
 */
export const queryChatGroup = async (): Promise<ChatGroup[]> => {
  const res = await request<ChatGroup[]>({
    url: `${config.url}/group/query`,
    method: 'GET',
    data: {},
  });
  return res.data;
};

/**
 * 创建一个会话
 */
export const createChat = async ({ appId }: { appId: number }) => {
  const res = await request<ChatGroup>({
    url: `${config.url}/group/create`,
    method: 'POST',
    data: { appId },
  });
  return res.data;
};

/**
 * 获取聊天记录
 */
export const queryChat = async ({ groupId }: { groupId: number }): Promise<Message[]> => {
  const res = await request<Message[]>({
    url: `${config.url}/chatlog/chatList`,
    method: 'GET',
    data: { groupId },
  });
  return res.data || [];
};

/**
 * 一次对话
 */
export const chatProcrssOnce = async params => {
  const res = await request<Message[]>({
    url: `${config.url}/chatgpt/chat-process`,
    method: 'POST',
    data: params,
  });
  return res.data;
}