import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();
  
  // Маппинг имен для путей
  const pathLabelMap: Record<string, string> = {
    catalog_tco: 'Каталог услуг TCO',
  };
  
  // Функция для получения человеко-читаемого названия
  const getLabel = (path: string): string => {
    return pathLabelMap[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/_/g, ' ');
  };
  
  // Автоматически определяем breadcrumbs на основе пути
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Всегда добавляем "Главная" как первый элемент
    breadcrumbs.push({
      label: 'Главная',
      path: '/',
    });
    
    // Генерируем breadcrumbs для каждого уровня пути
    if (pathnames.length > 0) {
      pathnames.forEach((value, index) => {
        const isNumericId = /^\d+$/.test(value);
        
        // Если это ID, показываем как "Детали услуги"
        if (isNumericId) {
          breadcrumbs.push({
            label: 'Детали услуги',
            path: location.pathname,
          });
          return;
        }
        
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = getLabel(value);
        breadcrumbs.push({
          label,
          path: to,
        });
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={index} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-current">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              )}
              {!isLast && <span className="breadcrumb-separator">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
