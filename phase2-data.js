/* Projeto Ativa — normalização retrocompatível dos dados da Fase 2.
 * Este módulo não altera a estrutura antiga nem faz chamadas de rede.
 * Dados opcionais ausentes são tratados como coleções vazias.
 */
(function (root) {
  'use strict';

  const COLLECTIONS = {
    exercisePlan: {
      fields: ['id', 'weekday', 'activity', 'durationMinutes', 'notes', 'active'],
      strings: { id: 80, activity: 120, notes: 1000 },
      numbers: { weekday: [0, 6], durationMinutes: [1, 600] },
      booleans: ['active']
    },
    exerciseRecords: {
      fields: ['id', 'date', 'activity', 'durationMinutes', 'intensity', 'completed', 'notes'],
      strings: { id: 80, date: 10, activity: 120, intensity: 20, notes: 1500 },
      numbers: { durationMinutes: [1, 600] },
      booleans: ['completed'],
      enums: { intensity: ['leve', 'moderada', 'intensa'] },
      dates: ['date']
    },
    healthMetrics: {
      fields: ['id', 'date', 'weightKg', 'waistCm', 'hipCm', 'notes'],
      strings: { id: 80, date: 10, notes: 1000 },
      numbers: { weightKg: [1, 500], waistCm: [1, 300], hipCm: [1, 400] },
      dates: ['date']
    },
    moodEntries: {
      fields: ['id', 'date', 'mood', 'factors', 'needs', 'notes'],
      strings: { id: 80, date: 10, mood: 30, factors: 500, needs: 500, notes: 2000 },
      enums: { mood: ['muito bem', 'bem', 'neutro', 'cansada', 'triste/sobrecarregada'] },
      dates: ['date']
    },
    journalEntries: {
      fields: ['id', 'date', 'gratefulFor', 'bestPart', 'learned', 'differentNextTime', 'text'],
      strings: { id: 80, date: 10, gratefulFor: 1500, bestPart: 1500, learned: 1500, differentNextTime: 1500, text: 6000 },
      dates: ['date']
    },
    spiritualEntries: {
      fields: ['id', 'date', 'practice', 'reference', 'reflection', 'notes'],
      strings: { id: 80, date: 10, practice: 40, reference: 160, reflection: 3000, notes: 1500 },
      enums: { practice: ['oração', 'bíblia', 'meditação', 'outra'] },
      dates: ['date']
    },
    homeTasks: {
      fields: ['id', 'title', 'category', 'date', 'recurrence', 'completed', 'notes'],
      strings: { id: 80, title: 160, category: 40, date: 10, recurrence: 20, notes: 1000 },
      enums: {
        category: ['limpeza', 'roupas', 'cozinha', 'compras', 'organização', 'outro'],
        recurrence: ['única', 'diária', 'semanal', 'mensal']
      },
      dates: ['date'],
      booleans: ['completed']
    },
    familyEntries: {
      fields: ['id', 'date', 'activity', 'people', 'description'],
      strings: { id: 80, date: 10, activity: 120, people: 300, description: 3000 },
      dates: ['date']
    }
  };

  function plainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T12:00:00');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function normalizeRecord(record, schema) {
    if (!plainObject(record)) return null;
    const clean = {};
    for (const field of schema.fields) {
      if (!Object.prototype.hasOwnProperty.call(record, field)) continue;
      const value = record[field];
      if (schema.enums && schema.enums[field]) {
        if (typeof value === 'string' && schema.enums[field].includes(value)) clean[field] = value;
      } else if (schema.strings && schema.strings[field]) {
        if (typeof value !== 'string') continue;
        clean[field] = value.slice(0, schema.strings[field]);
      } else if (schema.numbers && schema.numbers[field]) {
        const [min, max] = schema.numbers[field];
        if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) continue;
        clean[field] = value;
      } else if (schema.booleans && schema.booleans.includes(field)) {
        if (typeof value === 'boolean') clean[field] = value;
      }
    }
    if (schema.dates) {
      for (const field of schema.dates) {
        if (Object.prototype.hasOwnProperty.call(record, field) && !validDate(record[field])) return null;
      }
    }
    if (typeof clean.id !== 'string' || !clean.id.trim()) return null;
    return clean;
  }

  function normalize(input) {
    if (!plainObject(input)) return input;
    const output = { ...input };
    for (const [name, schema] of Object.entries(COLLECTIONS)) {
      const source = input[name];
      if (source === undefined) {
        output[name] = [];
        continue;
      }
      if (!Array.isArray(source)) {
        output[name] = [];
        continue;
      }
      output[name] = source.slice(0, 500)
        .map(record => normalizeRecord(record, schema))
        .filter(Boolean);
    }
    return output;
  }

  root.ProjetoAtivaPhase2 = Object.freeze({ normalize, validDate });
})(window);
