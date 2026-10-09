package common

import (
	"testing"
)

func TestContainsPII(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected bool
	}{
		{"Clean text", "Can someone explain how recursion works in C++?", false},
		{"Roll number", "My roll no is 7376221CS101, please help!", true},
		{"Roll number 2", "Contact 23CSE102 for notes", true},
		{"Phone number", "Call me at 9843777817 for details", true},
		{"Phone with spaces", "My mobile is 9 8 4 3 7 7 7 8 1 7", true},
		{"Email address", "Send solution to student@bitsathy.ac.in", true},
		{"Email disguised", "email me at student at gmail dot com", true},
		{"Social handle", "Ping me on instagram.com/jaison_dev", true},
		{"Social handle 2", "My Telegram is t.me/student123", true},
		{"Contact intent", "Please DM me for the assignment solution", true},
		{"Contact intent 2", "Whatsapp me the answers", true},
		{"URL link", "Check out https://example.com/solution", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := containsPII(tt.input)
			if got != tt.expected {
				t.Errorf("containsPII(%q) = %v; want %v", tt.input, got, tt.expected)
			}
		})
	}
}

func TestContainsProfanity(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected bool
	}{
		{"Clean educational text", "This assignment on data structures is challenging", false},
		{"Contains 'class'", "We have a class tomorrow at 9 AM", false},
		{"Contains 'pass'", "Did everyone pass the exam?", false},
		{"Direct profanity", "This project is complete shit", true},
		{"Obfuscated profanity", "F.u.c.k this homework", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := containsProfanity(tt.input)
			if got != tt.expected {
				t.Errorf("containsProfanity(%q) = %v; want %v", tt.input, got, tt.expected)
			}
		})
	}
}
