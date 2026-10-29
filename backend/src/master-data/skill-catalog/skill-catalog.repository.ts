import type {
  ClientSession,
  Types,
} from "mongoose";

import { SkillCatalogModel } from "./skill-catalog.schema.js";

import type {
  SkillCatalogDocument,
} from "./skill-catalog.schema.js";

class SkillCatalogRepository {
  async findActive(
    session?: ClientSession
  ): Promise<SkillCatalogDocument[]> {
    return SkillCatalogModel.find({
      isActive: true,
    }).session(session ?? null);
  }

  async findActiveByIds(
    skillCatalogIds: Types.ObjectId[],
    session?: ClientSession
  ): Promise<SkillCatalogDocument[]> {
    if (skillCatalogIds.length === 0) {
      return [];
    }

    return SkillCatalogModel.find({
      _id: {
        $in: skillCatalogIds,
      },

      isActive: true,
    }).session(session ?? null);
  }
}

export const skillCatalogRepository =
  new SkillCatalogRepository();
