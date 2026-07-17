import {
    TOPIC_CATALOG,
} from '../data/topic-catalog/topic-catalog.js';

export function isTopicAllowedForSkill(
    skillCode: string,
    topicCode: string
): boolean {

    const skillTopics =
        TOPIC_CATALOG[
            skillCode as keyof typeof TOPIC_CATALOG
        ];

    if (!skillTopics) {
        return false;
    }

    return topicCode in skillTopics;
}

export function areTopicsAllowedForSkill(
    skillCode: string,
    topicCodes: string[]
): boolean {

    return topicCodes.every(
        topicCode =>
            isTopicAllowedForSkill(
                skillCode,
                topicCode
            )
    );
}