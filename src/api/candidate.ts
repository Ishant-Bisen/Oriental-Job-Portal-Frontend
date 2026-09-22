import { apiGet, apiPut } from '@/lib/api'

/** Matches Swagger `CandidateProfileResponse`. */
export type CandidateProfile = {
  id: number
  firstName?: string
  lastName?: string
  email: string
  mobile?: string
  address?: string
  major?: string
  highestQualification?: string
  profilePicture?: string
  resumePdf?: string
  updatedAt?: string
}

/** Matches Swagger `CandidateProfileRequest` — omit or null to leave unchanged. */
export type CandidateProfileUpdate = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  mobile?: string | null
  address?: string | null
  major?: string | null
  highestQualification?: string | null
  resumePdf?: string | null
  profilePicture?: string | null
}

export function fetchCandidateProfile() {
  return apiGet<CandidateProfile>('/api/candidate/get/profile')
}

export function updateCandidateProfile(payload: CandidateProfileUpdate) {
  return apiPut<CandidateProfile>('/api/candidate/update/profile', payload)
}

export function displayName(profile: Pick<CandidateProfile, 'firstName' | 'lastName' | 'email'>) {
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim()
  return name || profile.email
}

/** True when the candidate has a non-empty resume URL on their profile. */
export function hasResume(profile?: Pick<CandidateProfile, 'resumePdf'> | null) {
  return Boolean(profile?.resumePdf?.trim())
}

