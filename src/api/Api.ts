/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CompleteCalculationTCO {
  /** Action */
  action: "complete" | "reject";
  /** Moderator comment */
  moderator_comment?: string;
}

export interface ServiceTCOList {
  /** ID */
  id?: number;
  /**
   * Наименование
   * Название услуги
   * @minLength 1
   * @maxLength 200
   */
  name: string;
  /**
   * Описание
   * Описание услуги
   * @minLength 1
   */
  description: string;
  /**
   * Полное описание
   * Подробное описание услуги с включенными сервисами
   * @minLength 1
   */
  fullDescription: string;
  /**
   * Стоимость
   * Стоимость услуги в рублях
   * @format decimal
   */
  price: string;
  /**
   * Тип стоимости
   * Единовременная, ежемесячная или ежегодная оплата
   */
  price_type?: "one_time" | "monthly" | "yearly";
  /**
   * URL изображения
   * Ссылка на изображение услуги
   * @format uri
   * @maxLength 200
   */
  image_url?: string | null;
  /**
   * Статус удален
   * Помечена ли услуга как удаленная
   */
  is_deleted?: boolean;
}

export interface CalculationService {
  /** ID */
  id?: number;
  /** Расчет */
  calculation?: number;
  /** Услуга */
  service?: number;
  service_details?: ServiceTCOList;
  /** Service id */
  service_id?: number;
  /** Calculation id */
  calculation_id?: number;
  /**
   * Количество
   * Количество единиц услуги
   * @min 0
   * @max 2147483647
   */
  quantity?: number;
}

export interface CalculationTCO {
  /** ID */
  id?: number;
  /**
   * Статус
   * @default "draft"
   */
  status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
  /**
   * Дата создания
   * @format date-time
   */
  created_at?: string;
  /**
   * Дата формирования
   * @format date-time
   */
  formed_at?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  completed_at?: string | null;
  /** Creator */
  creator?: string;
  /** Moderator */
  moderator?: string;
  /**
   * Общая стоимость
   * Рассчитывается при завершении заявки
   * @format decimal
   */
  total_cost?: string | null;
  /**
   * Срок эксплуатации (месяцев)
   * Рассчитывается при завершении заявки
   */
  duration_months?: number | null;
  /**
   * Дата начала эксплуатации
   * Дата начала эксплуатации актива
   * @format date
   */
  start_date?: string | null;
  /**
   * Дата окончания эксплуатации
   * Дата окончания эксплуатации актива
   * @format date
   */
  end_date?: string | null;
  calculation_services?: CalculationService[];
}

export interface FormCalculationTCO {
  /**
   * Start date
   * @format date
   */
  start_date: string;
  /**
   * End date
   * @format date
   */
  end_date: string;
}

export interface Login {
  /**
   * Email
   * Email пользователя
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * Password
   * Пароль пользователя
   * @minLength 1
   */
  password: string;
}

export interface ServiceTCO {
  /** ID */
  id?: number;
  /**
   * Наименование
   * Название услуги
   * @minLength 1
   * @maxLength 200
   */
  name?: string;
  /**
   * Описание
   * Описание услуги
   * @minLength 1
   */
  description?: string;
  /**
   * Полное описание
   * Подробное описание услуги с включенными сервисами
   * @minLength 1
   */
  fullDescription?: string;
  /**
   * Стоимость
   * Стоимость услуги в рублях
   * @format decimal
   */
  price?: string;
  /**
   * Тип стоимости
   * Единовременная, ежемесячная или ежегодная оплата
   */
  price_type?: "one_time" | "monthly" | "yearly";
  /**
   * URL изображения
   * Ссылка на изображение услуги
   * @format uri
   * @maxLength 200
   */
  image_url?: string | null;
  /**
   * Статус удален
   * Помечена ли услуга как удаленная
   */
  is_deleted?: boolean;
}

export interface CustomUser {
  /**
   * Email
   * Email пользователя
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * Дата регистрации
   */
  date_joined?: string;
  /**
   * Идентификатор пользователя
   */
  id?: number;
  /**
   * Password
   * Пароль пользователя
   * @minLength 1
   */
  password: string;
  /**
   * Is staff
   * Статус сотрудника
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * Статус суперпользователя
   * @default false
   */
  is_superuser?: boolean;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8000/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Asset Cost Calculator API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@example.com>
 *
 * API для системы расчета стоимости активов TCO
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  calculationService = {
    /**
     * @description DELETE удаление услуги из заявки-черновика
     *
     * @tags calculation-service
     * @name CalculationServiceDelete
     * @request DELETE:/calculation-service/
     * @secure
     */
    calculationServiceDelete: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/calculation-service/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description PUT изменение количества/порядка/значения в заявке-черновике
     *
     * @tags calculation-service
     * @name CalculationServiceUpdateUpdate
     * @request PUT:/calculation-service/update/
     * @secure
     */
    calculationServiceUpdateUpdate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/calculation-service/update/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  calculationTco = {
    /**
     * @description GET список заявок (кроме удаленных) с фильтрацией по статусу и датам
     *
     * @tags calculation_tco
     * @name CalculationTcoList
     * @request GET:/calculation_tco/
     * @secure
     */
    calculationTcoList: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/calculation_tco/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description GET одна заявка с услугами и картинками
     *
     * @tags calculation_tco
     * @name CalculationTcoRead
     * @request GET:/calculation_tco/{id}/
     * @secure
     */
    calculationTcoRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/calculation_tco/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description PUT завершить/отклонить заявку (вычисление стоимости)
     *
     * @tags calculation_tco
     * @name CalculationTcoCompleteUpdate
     * @request PUT:/calculation_tco/{id}/complete/
     * @secure
     */
    calculationTcoCompleteUpdate: (
      id: string,
      data: CompleteCalculationTCO,
      params: RequestParams = {},
    ) =>
      this.request<CalculationTCO, void>({
        path: `/calculation_tco/${id}/complete/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description DELETE удаление заявки (логическое удаление)
     *
     * @tags calculation_tco
     * @name CalculationTcoDeleteDelete
     * @request DELETE:/calculation_tco/{id}/delete/
     * @secure
     */
    calculationTcoDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/calculation_tco/${id}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description PUT сформировать заявку (проверка обязательных полей)
     *
     * @tags calculation_tco
     * @name CalculationTcoFormUpdate
     * @request PUT:/calculation_tco/{id}/form/
     * @secure
     */
    calculationTcoFormUpdate: (
      id: string,
      data: FormCalculationTCO,
      params: RequestParams = {},
    ) =>
      this.request<CalculationTCO, void>({
        path: `/calculation_tco/${id}/form/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description PUT изменения полей заявки
     *
     * @tags calculation_tco
     * @name CalculationTcoUpdateUpdate
     * @request PUT:/calculation_tco/{id}/update/
     * @secure
     */
    calculationTcoUpdateUpdate: (
      id: string,
      data: FormCalculationTCO,
      params: RequestParams = {},
    ) =>
      this.request<CalculationTCO, void>({
        path: `/calculation_tco/${id}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  cartTco = {
    /**
     * @description GET иконки корзины (id заявки-черновика + количество услуг)
     *
     * @tags cart_tco
     * @name CartTcoList
     * @request GET:/cart_tco/
     * @secure
     */
    cartTcoList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cart_tco/`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  login = {
    /**
     * @description Авторизация пользователя в системе
     *
     * @tags login
     * @name LoginCreate
     * @summary Вход в систему
     * @request POST:/login
     */
    loginCreate: (data: Login, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * @description Функция выхода из системы согласно методичке
     *
     * @tags logout
     * @name LogoutCreate
     * @request POST:/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  serviceTco = {
    /**
     * @description Получение списка услуг с возможностью фильтрации и поиска
     *
     * @tags service_tco
     * @name ServiceTcoList
     * @request GET:/service_tco/
     * @secure
     */
    serviceTcoList: (
      query?: {
        /** Поиск по названию услуги */
        search?: string;
        /** Минимальная цена */
        price_from?: number;
        /** Максимальная цена */
        price_to?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/service_tco/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description POST добавление услуги (без изображения)
     *
     * @tags service_tco
     * @name ServiceTcoCreateCreate
     * @request POST:/service_tco/create/
     * @secure
     */
    serviceTcoCreateCreate: (data: ServiceTCO, params: RequestParams = {}) =>
      this.request<ServiceTCO, void>({
        path: `/service_tco/create/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description GET одна запись услуги
     *
     * @tags service_tco
     * @name ServiceTcoRead
     * @request GET:/service_tco/{id}/
     * @secure
     */
    serviceTcoRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/service_tco/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description POST добавление услуги в заявку-черновик
     *
     * @tags service_tco
     * @name ServiceTcoAddToCartCreate
     * @request POST:/service_tco/{id}/add-to-cart/
     * @secure
     */
    serviceTcoAddToCartCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/service_tco/${id}/add-to-cart/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description DELETE удаление услуги (логическое удаление + удаление изображения)
     *
     * @tags service_tco
     * @name ServiceTcoDeleteDelete
     * @request DELETE:/service_tco/{id}/delete/
     * @secure
     */
    serviceTcoDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/service_tco/${id}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description POST добавление изображения услуги
     *
     * @tags service_tco
     * @name ServiceTcoImageCreate
     * @request POST:/service_tco/{id}/image/
     * @secure
     */
    serviceTcoImageCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/service_tco/${id}/image/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description PUT изменение услуги
     *
     * @tags service_tco
     * @name ServiceTcoUpdateUpdate
     * @request PUT:/service_tco/{id}/update/
     * @secure
     */
    serviceTcoUpdateUpdate: (
      id: string,
      data: ServiceTCO,
      params: RequestParams = {},
    ) =>
      this.request<ServiceTCO, void>({
        path: `/service_tco/${id}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserList
     * @request GET:/user/
     * @secure
     */
    userList: (
      query?: {
        /** A page number within the paginated result set. */
        page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          count: number;
          /** @format uri */
          next?: string | null;
          /** @format uri */
          previous?: string | null;
          results: CustomUser[];
        },
        any
      >({
        path: `/user/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Функция регистрации новых пользователей Если пользователя c указанным в request email ещё нет, в БД будет добавлен новый пользователь.
     *
     * @tags user
     * @name UserCreate
     * @request POST:/user/
     */
    userCreate: (data: CustomUser, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description GET профиль пользователя после аутентификации
     *
     * @tags user
     * @name UserProfileList
     * @request GET:/user/profile/
     * @secure
     */
    userProfileList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/profile/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description PUT изменение профиля пользователя
     *
     * @tags user
     * @name UserProfileUpdateUpdate
     * @request PUT:/user/profile/update/
     * @secure
     */
    userProfileUpdateUpdate: (data: CustomUser, params: RequestParams = {}) =>
      this.request<CustomUser, void>({
        path: `/user/profile/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserRead
     * @request GET:/user/{id}/
     * @secure
     */
    userRead: (id: number, params: RequestParams = {}) =>
      this.request<CustomUser, any>({
        path: `/user/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserUpdate
     * @request PUT:/user/{id}/
     * @secure
     */
    userUpdate: (id: number, data: CustomUser, params: RequestParams = {}) =>
      this.request<CustomUser, any>({
        path: `/user/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserPartialUpdate
     * @request PATCH:/user/{id}/
     * @secure
     */
    userPartialUpdate: (
      id: number,
      data: CustomUser,
      params: RequestParams = {},
    ) =>
      this.request<CustomUser, any>({
        path: `/user/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserDelete
     * @request DELETE:/user/{id}/
     * @secure
     */
    userDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
