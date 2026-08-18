import type { PrismaPromise } from "@prisma/client";
import type * as runtime from "@prisma/client/runtime/library.js";

type $Extensions = runtime.Types.Extensions;
type $Result = runtime.Types.Result;
type InternalArgs = runtime.Types.Extensions.InternalArgs;
type DefaultArgs = runtime.Types.Extensions.DefaultArgs;

type FavouriteBase = {
  id: string;
  user_id: string;
  animal_id: string;
  created_at: Date;
};

declare module "@prisma/client" {
  export type favourites = $Result.DefaultSelection<Prisma.$favouritesPayload>;

  namespace Prisma {
    export type $favouritesPayload<
      ExtArgs extends InternalArgs = DefaultArgs
    > = {
      name: "favourites";
      objects: {
        animals: Prisma.$animalsPayload<ExtArgs>;
        users: Prisma.$usersPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        FavouriteBase,
        ExtArgs["result"]["favourites"]
      >;
      composites: {};
    };

    export interface favouritesDelegate<
      ExtArgs extends InternalArgs = DefaultArgs,
      GlobalOmitOptions = {}
    > {
      findUnique<T = any>(args?: any): PrismaPromise<(FavouriteBase & any) | null>;
      findUniqueOrThrow<T = any>(args?: any): PrismaPromise<FavouriteBase & any>;
      findFirst<T = any>(args?: any): PrismaPromise<(FavouriteBase & any) | null>;
      findFirstOrThrow<T = any>(args?: any): PrismaPromise<FavouriteBase & any>;
      findMany<T = any>(args?: any): PrismaPromise<Array<FavouriteBase & any>>;
      create<T = any>(args: any): PrismaPromise<FavouriteBase & any>;
      createMany<T = any>(args?: any): PrismaPromise<any>;
      createManyAndReturn<T = any>(args?: any): PrismaPromise<Array<FavouriteBase & any>>;
      delete<T = any>(args: any): PrismaPromise<FavouriteBase & any>;
      update<T = any>(args: any): PrismaPromise<FavouriteBase & any>;
      deleteMany<T = any>(args?: any): PrismaPromise<any>;
      updateMany<T = any>(args?: any): PrismaPromise<any>;
      updateManyAndReturn<T = any>(args?: any): PrismaPromise<Array<FavouriteBase & any>>;
      upsert<T = any>(args: any): PrismaPromise<FavouriteBase & any>;
      aggregate<T = any>(args?: any): PrismaPromise<any>;
      groupBy<T = any>(args?: any): PrismaPromise<any>;
      count<T = any>(args?: any): PrismaPromise<any>;
      fields: any;
    }
  }

  interface PrismaClient {
    readonly favourites: Prisma.favouritesDelegate;
  }
}
