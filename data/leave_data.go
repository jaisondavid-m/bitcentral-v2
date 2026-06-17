package data

import "server/models"

var Holidays = []models.Holiday{
	// June 2026
	{
		FromDate: "2026-06-25(AN)",
		ToDate:   "2026-06-29",
		Name:     "GP & Muharram",
	},

	// July 2026
	{
		FromDate: "2026-07-24(AN)",
		ToDate:   "2026-07-28",
		Name:     "GP",
	},

	// August 2026
	{
		FromDate: "2026-08-15",
		ToDate:   "2026-08-15",
		Day:      "Saturday",
		Name:     "Independence Day",
	},
	{
		FromDate: "2026-08-22(AN)",
		ToDate:   "2026-08-26",
		Name:     "GP & Milad un Nabi",
	},

	// September 2026
	{
		FromDate: "2026-09-04",
		ToDate:   "2026-09-04",
		Day:      "Friday",
		Name:     "Krishna Jayanthi",
	},
	{
		FromDate: "2026-09-14",
		ToDate:   "2026-09-14",
		Day:      "Monday",
		Name:     "Vinayakar Chathurthi",
	},
	{
		FromDate: "2026-09-24(AN)",
		ToDate:   "2026-09-29",
		Name:     "GP",
	},

	// October 2026
	{
		FromDate: "2026-10-02",
		ToDate:   "2026-10-02",
		Day:      "Friday",
		Name:     "Gandhi Jayanthi",
	},
	{
		FromDate: "2026-10-17(AN)",
		ToDate:   "2026-10-21",
		Name:     "GP & Pooja Holidays",
	},

	// November 2026
	{
		FromDate: "2026-11-06(AN)",
		ToDate:   "2026-11-10",
		Name:     "GP & Diwali",
	},

	// December 2026
	{
		FromDate: "2026-12-25",
		ToDate:   "2026-12-25",
		Day:      "Friday",
		Name:     "Christmas",
	},
	{
		FromDate: "2026-12-31(AN)",
		ToDate:   "2027-01-04",
		Name:     "GP & New Year",
	},

	// January 2027
	{
		FromDate: "2027-01-14(AN)",
		ToDate:   "2027-01-18",
		Name:     "GP & Pongal Holidays",
	},
	{
		FromDate: "2027-01-22",
		ToDate:   "2027-01-22",
		Day:      "Friday",
		Name:     "Thai Poosam",
	},
	{
		FromDate: "2027-01-26",
		ToDate:   "2027-01-26",
		Day:      "Tuesday",
		Name:     "Republic Day",
	},

	// February 2027
	{
		FromDate: "2027-02-26(AN)",
		ToDate:   "2027-03-02",
		Name:     "GP",
	},

	// March 2027
	{
		FromDate: "2027-03-11",
		ToDate:   "2027-03-11",
		Day:      "Thursday",
		Name:     "Ramzan",
	},
	{
		FromDate: "2027-03-25(AN)",
		ToDate:   "2027-03-29",
		Name:     "GP & Good Friday",
	},

	// April 2027
	{
		FromDate: "2027-04-14",
		ToDate:   "2027-04-14",
		Day:      "Wednesday",
		Name:     "Tamil New Year",
	},
	{
		FromDate: "2027-04-30(AN)",
		ToDate:   "2027-05-04",
		Name:     "GP & May Day",
	},

	// May 2027
	{
		FromDate: "2027-05-27(AN)",
		ToDate:   "2027-05-31",
		Name:     "GP",
	},
}