package data

import "server/models"

func strPtr(s string) *string {
	return &s
}

var SemestersData = map[int][]models.SemesterSubject{
	25: {
		{
			Code:         nil, // or strPtr("22MA101")
			Name:         nil, // or strPtr("ENGINEERING MATHEMATICS I")
			QB1:          nil,
			QB2:          nil,
			AK1:          nil,
			AK2:          nil,
			SemQBWithAns: nil,
		},
	},
	24: {
		{
			Code:         nil,
			Name:         nil,
			QB1:          nil,
			QB2:          nil,
			AK1:          nil,
			AK2:          nil,
			SemQBWithAns: nil,
		},
	},
	23: {
		{
			Code:         nil,
			Name:         nil,
			QB1:          nil,
			QB2:          nil,
			AK1:          nil,
			AK2:          nil,
			SemQBWithAns: nil,
		},
	},
	22: {
		{
			Code:         nil,
			Name:         nil,
			QB1:          nil,
			QB2:          nil,
			AK1:          nil,
			AK2:          nil,
			SemQBWithAns: nil,
		},
	},
}