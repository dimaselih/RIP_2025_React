import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import './Breadcrumbs.css';

interface ICrumb {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  return (
    <ul className="breadcrumbs">
      <li>
        <Link to={ROUTES.HOME}>Главная</Link>
      </li>
      {!!crumbs.length &&
        crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <li className="slash">/</li>
            {index === crumbs.length - 1 ? (
              <li>{crumb.label}</li>
              ) : (
              <li>
                <Link to={crumb.path || ''}>{crumb.label}</Link>
              </li>
              )}
          </React.Fragment>
        ))}
    </ul>
  );
};

export default Breadcrumbs;
