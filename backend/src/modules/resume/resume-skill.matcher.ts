import type {
    SkillCatalogDocument,
} from "../../master-data/skill-catalog/skill-catalog.schema.js";

import {
    skillCatalogRepository,
} from "../../master-data/skill-catalog/skill-catalog.repository.js";

import type {
    ResumeExtractedSkill,
    ResumeSkillAnalysis,
} from "./resume.types.js";

interface CatalogEntry {
    skill: SkillCatalogDocument;

    normalizedName: string;

    keys: Set<string>;
}

const normalizeSkillName = (
    value: string
): string =>
    value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9+#. ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const compactSkillName = (
    value: string
): string =>
    normalizeSkillName(value).replace(
        /[\s.\-_/]/g,
        ""
    );

const stripParenthetical = (
    value: string
): string =>
    value.replace(/\([^)]*\)/g, " ");

const stripVersion = (
    value: string
): string =>
    value.replace(/\bv?\d+(?:\.\d+)*\b/g, " ");

const addKey = (
    keys: Set<string>,
    value: string | null | undefined
): void => {
    if (!value) {
        return;
    }

    const normalizedValue =
        normalizeSkillName(value);

    if (normalizedValue.length > 0) {
        keys.add(normalizedValue);
    }

    const compactValue =
        compactSkillName(value);

    if (compactValue.length > 0) {
        keys.add(compactValue);
    }
};

const buildCatalogEntries = (
    skills: SkillCatalogDocument[]
): CatalogEntry[] =>
    skills.map((skill) => {
        const keys = new Set<string>();

        addKey(keys, skill.name);
        addKey(keys, skill.slug);

        for (const alias of skill.aliases ?? []) {
            addKey(keys, alias);
        }

        return {
            skill,

            normalizedName: normalizeSkillName(
                skill.name
            ),

            keys,
        };
    });

const buildCandidates = (
    value: string
): string[] => {
    const values = [
        value,
        stripParenthetical(value),
        stripVersion(value),
        stripVersion(stripParenthetical(value)),
    ];

    const candidates = new Set<string>();

    for (const candidate of values) {
        const normalizedCandidate =
            normalizeSkillName(candidate);

        if (normalizedCandidate.length > 0) {
            candidates.add(normalizedCandidate);
        }

        const compactCandidate =
            compactSkillName(candidate);

        if (compactCandidate.length > 0) {
            candidates.add(compactCandidate);
        }
    }

    return [...candidates];
};

const containsWholePhrase = (
    candidate: string,
    key: string
): boolean => {
    if (
        key.length < 4 ||
        candidate.length < key.length
    ) {
        return false;
    }

    return ` ${candidate} `.includes(` ${key} `);
};

const findCatalogSkill = (
    extractedName: string,
    entries: CatalogEntry[]
): SkillCatalogDocument | null => {
    const candidates = buildCandidates(
        extractedName
    );

    for (const candidate of candidates) {
        for (const entry of entries) {
            if (entry.keys.has(candidate)) {
                return entry.skill;
            }
        }
    }

    for (const candidate of candidates) {
        for (const entry of entries) {
            if (
                containsWholePhrase(
                    candidate,
                    entry.normalizedName
                )
            ) {
                return entry.skill;
            }
        }
    }

    return null;
};

const normalizeConfidence = (
    confidence: number
): number =>
    Math.min(
        1,
        Math.max(0, confidence)
    );

const mergeSkillAnalysis = (
    current: ResumeSkillAnalysis | undefined,
    incoming: ResumeSkillAnalysis
): ResumeSkillAnalysis =>
    current &&
    current.confidence >= incoming.confidence
        ? current
        : incoming;

export class ResumeSkillMatcher {
    async match(
        extractedSkills: ResumeExtractedSkill[]
    ): Promise<ResumeSkillAnalysis[]> {
        const catalogSkills =
            await skillCatalogRepository.findActive();

        const entries = buildCatalogEntries(
            catalogSkills
        );

        const results = new Map<
            string,
            ResumeSkillAnalysis
        >();

        for (const extractedSkill of extractedSkills) {
            const catalogSkill =
                findCatalogSkill(
                    extractedSkill.name,
                    entries
                );

            const name =
                catalogSkill?.name ??
                extractedSkill.name;

            const key = catalogSkill
                ? `catalog:${catalogSkill._id.toString()}`
                : `unmatched:${compactSkillName(
                    extractedSkill.name
                )}`;

            const analysis: ResumeSkillAnalysis = {
                skillCatalogId: catalogSkill
                    ? catalogSkill._id
                    : null,

                name,

                slug: catalogSkill?.slug ?? null,

                evidence: extractedSkill.evidence,

                confidence: normalizeConfidence(
                    extractedSkill.confidence
                ),

                matched: Boolean(catalogSkill),
            };

            results.set(
                key,
                mergeSkillAnalysis(
                    results.get(key),
                    analysis
                )
            );
        }

        return [...results.values()];
    }
}

export const resumeSkillMatcher =
    new ResumeSkillMatcher();
