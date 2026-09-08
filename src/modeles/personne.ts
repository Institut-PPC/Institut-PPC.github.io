import { z } from 'zod';

export const rolesPpc = [
  'co-presidence',
  'conseil-administration',
  'conseil-administration-representant-vivant',
  'equipe-operationnelle',
  'membre-fondateur',
  'partenaire',
  'mecene',
] as const;

export type RolePpc = (typeof rolesPpc)[number];

const rolesAvecInformationsPubliquesObligatoires = new Set<RolePpc>([
  'co-presidence',
  'conseil-administration',
  'conseil-administration-representant-vivant',
  'membre-fondateur',
]);

const schemaTexteObligatoire = z.string().trim().min(1, 'Ce champ ne peut pas être vide.');

export const schemaIdentifiantPpc = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'L’identifiant doit être en ASCII minuscule et en kebab-case.');

export const schemaRolePpc = z.enum(rolesPpc);

export function creerSchemaPersonne<TPhoto extends z.ZodType>(schemaPhoto: TPhoto) {
  return z
    .object({
      prenom: schemaTexteObligatoire,
      nom: schemaTexteObligatoire,
      organisation: schemaIdentifiantPpc.optional(),
      fonction_organisation: z.string().optional(),
      roles_ppc: z.array(schemaRolePpc).optional(),
      photo: schemaPhoto.optional(),
      linkedin: z.url({ protocol: /^https?$/ }).optional(),
    })
    .strict()
    .superRefine((personne, contexte) => {
      const informationsPubliquesObligatoires =
        personne.roles_ppc?.some((role) => rolesAvecInformationsPubliquesObligatoires.has(role)) ?? false;

      if (!informationsPubliquesObligatoires) {
        return;
      }

      if (personne.photo === undefined) {
        contexte.addIssue({
          code: 'custom',
          path: ['photo'],
          message: 'Une photo est obligatoire pour ce rôle PPC.',
        });
      }

      if (personne.linkedin === undefined) {
        contexte.addIssue({
          code: 'custom',
          path: ['linkedin'],
          message: 'Une URL LinkedIn est obligatoire pour ce rôle PPC.',
        });
      }
    });
}

export const schemaPersonne = creerSchemaPersonne(schemaTexteObligatoire);

export type Personne = z.infer<typeof schemaPersonne>;
