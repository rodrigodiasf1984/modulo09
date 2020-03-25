import { toast } from 'react-toastify';

import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
import {
  updateProfileSuccess,
  updateProfileFailure,
} from '~/store/modules/user/actions';

export function* updateProfile({ payload }) {
  try {
    const { name, email, avatar_id, ...rest } = payload.data;
    // Object.assign serve para unir dois objects
    const profile = {
      name,
      email,
      avatar_id,
      ...(rest.oldPassword ? rest : {}),
    };

    const response = yield call(api.put, 'users', profile);

    toast.success('Perfil atualizado com sucesso');

    yield put(updateProfileSuccess(response.data));
    // atualiza os novos dados do utilizador
  } catch (error) {
    toast.error('Erro ao atualizar o perfil, confira seus dados!');
    yield put(updateProfileFailure()); // dispara a ação
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
