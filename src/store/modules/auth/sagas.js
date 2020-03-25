import { toast } from 'react-toastify';

import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
import history from '~/services/history';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', { email, password });
    // console.tron.log(response);
    const { token, user } = response.data;

    if (!user.provider) {
      toast.error('O utilizador não é um provedor de serviços');
      return;
    }

    yield put(signInSuccess(token, user));
    history.push('/dashboard');
  } catch (error) {
    toast.error('Falha na autenticação, verifique os dados digitados');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
      provider: true,
    });
    // depois do cadastro efectudoo novo utilizador é redirecionado para a tela de login
    history.push('/');
  } catch (error) {
    toast.error('Faha no cadastro, verifique seus dados!');
    yield put(signFailure());
  }
}

// function* é somente para async function
export function setToken({ payload }) {
  if (!payload) return; // se for a primeira vez que o utilizador estiver efetuado o login
  const { token } = payload.auth;

  if (token) {
    // recuperar o token da sessions
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  history.push('/'); // após o user ter executado o logout redireciona o mesmo para a página de login
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
