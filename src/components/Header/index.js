import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import blankAvatar from '~/assets/blank-profile-picture.webp';
import logo from '~/assets/logo-purple.svg';
import Notifications from '~/components/Notifications';

import { Container, Content, Profile } from './styles';

export default function Header() {
  const profile = useSelector(state => state.user.profile);

  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="GoBarber" />
          <Link to="/dashboard">DASHBOARD</Link>
        </nav>

        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>{profile.name}</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <img
              src={profile.avatar ? profile.avatar.url : blankAvatar}
              alt={profile.name}
            />
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
