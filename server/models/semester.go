package models

type SemesterSubject struct {
	Code          *string `json:"code"`
	Name          *string `json:"name"`
	QB1           *string `json:"qb1"`
	QB2           *string `json:"qb2"`
	AK1           *string `json:"ak1"`
	AK2           *string `json:"ak2"`
	SemQBWithAns  *string `json:"semqbwithans"`
}