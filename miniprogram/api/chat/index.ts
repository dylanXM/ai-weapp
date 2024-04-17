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
 * 更新对话组 
 */
export const updateGroup = async ({ groupId, title, modelConfig }: { groupId: number; title?: string, modelConfig?: string }) => {
  if (!groupId) {
    return;
  }
  const data = { groupId, title, config: modelConfig };
  if (!title) {
    delete data.title;
  }
  if (!modelConfig) {
    delete data.config;
  }
  const res = await request<ChatGroup[]>({
    url: `${config.url}/group/update`,
    method: 'POST',
    data,
  });
  return res.data;
};

/**
 * 删除对话组
 * @param param0 
 */
export const delGroup = async ({ groupId }: { groupId: number }) => {
  const res = await request<ChatGroup[]>({
    url: `${config.url}/group/del`,
    method: 'POST',
    data: { groupId },
  });
  return res.data;
};

/**
 * 清空对话组聊天信息
 * @param param0 
 */
export const clearGroup = async ({ groupId }: { groupId: number }) => {
  const res = await request<ChatGroup[]>({
    url: `${config.url}/chatlog/delByGroupId`,
    method: 'POST',
    data: { groupId },
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