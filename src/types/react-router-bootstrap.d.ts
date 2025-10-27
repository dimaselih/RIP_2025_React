// Декларация типов для react-router-bootstrap

declare module 'react-router-bootstrap' {
  import { ReactNode } from 'react';
  import { To } from 'react-router-dom';

  export interface LinkContainerProps {
    to: To;
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  export const LinkContainer: React.FC<LinkContainerProps>;
}
