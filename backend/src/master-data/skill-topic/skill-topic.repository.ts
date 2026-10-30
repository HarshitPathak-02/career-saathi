import type {
  ClientSession,
  Types,
} from "mongoose";

import { SkillTopicModel } from "./skill-topic.schema.js";
import type { SkillTopicDocument } from "./skill-topic.schema.js";

class SkillTopicRepository {
  async findActiveBySkillCatalogId(
    skillCatalogId: Types.ObjectId,
    session?: ClientSession
  ): Promise<SkillTopicDocument[]> {
    return SkillTopicModel.find({
      skillCatalogId,
      isActive: true,
    })
      .sort({
        displayOrder: 1,
      })
      .session(session ?? null);
  }

  async findActiveBySkillCatalogIds(
    skillCatalogIds: Types.ObjectId[],
    session?: ClientSession
  ): Promise<SkillTopicDocument[]> {
    if (skillCatalogIds.length === 0) {
      return [];
    }

    return SkillTopicModel.find({
      skillCatalogId: {
        $in: skillCatalogIds,
      },
      isActive: true,
    })
      .sort({
        skillCatalogId: 1,
        displayOrder: 1,
      })
      .session(session ?? null);
  }
}

export const skillTopicRepository =
  new SkillTopicRepository();
