import { DOCUMENT_TYPE_LABELS, type DocumentType } from '@interfluo/core';
import { Badge } from './ui/badge';

const TONE_MAP: Record<DocumentType, 'ink' | 'neutral' | 'accent' | 'muted'> = {
  draft_contract: 'ink',
  tr1: 'ink',
  title_register: 'accent',
  title_plan: 'accent',
  ta6: 'neutral',
  ta7: 'neutral',
  ta10: 'neutral',
  lease: 'ink',
  llc1: 'muted',
  con29: 'muted',
  drainage_water_search: 'muted',
  environmental_search: 'muted',
  chancel_search: 'muted',
  mining_search: 'muted',
  flood_search: 'muted',
  mortgage_offer: 'accent',
  epc: 'muted',
  unknown: 'muted',
};

export function DocumentTypeLabel({ type }: { type: DocumentType }) {
  return <Badge tone={TONE_MAP[type]}>{DOCUMENT_TYPE_LABELS[type]}</Badge>;
}
