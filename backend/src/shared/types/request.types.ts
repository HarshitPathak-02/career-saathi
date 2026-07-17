// shared/types/request.types.ts

import { Request } from "express";

export type TypedRequest<
    Params = {},
    Body = {},
    Query = {}
> = Request<Params, any, Body, Query>;