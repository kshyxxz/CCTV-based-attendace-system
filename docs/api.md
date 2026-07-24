## Student APIs:

use /students as url prefix

| Method |  Endpoint   |   Description    |
| :----: | :---------: | :--------------: |
|  GET   |     `/`     | Get all students |
|  GET   | `/<rollno>` |  Get a student   |
|  POST  |  `/create`  | Create a student |
|  PUT   |     `/`     | Update a student |
| DELETE |     `/`     | Delete a student |

### GET `/` : output

```json
[
	{
		"address": "Pokhara",
		"class_name": "A-101",
		"embedding": false,
		"name": "Sanjay Khadka",
		"phone": "9841000002",
		"rollno": "NCE080BCT002"
	},
	{
		"address": "Lalitpur",
		"class_name": "A-101",
		"embedding": false,
		"name": "Prabin Adhikari",
		"phone": "9841000003",
		"rollno": "NCE080BCT003"
	}
]
```

### GET `/<rollno>` : output

```json
{
	"address": "Pokhara",
	"class_name": "A-101",
	"embedding": false,
	"name": "Sanjay Khadka",
	"phone": "9841000002",
	"rollno": "NCE080BCT002"
}
```

### POST `/create` : input

```json
{
	"rollno": "NCE080BCT103",
	"fname": "Nylon",
	"lname": "Sharma",
	"class_name": "A-101",
	"phone": 9845118910,
	"address": "Bhaktapur"
}
```

### PUT `/` : input

```json
{
	"rollno": "NCE080BCT103",
	"fname": "Nylon",
	"lname": "Sharma",
	"class_name": "A-101",
	"phone": 9845118910,
	"address": "Bhaktapur"
}
```

### DELETE `/` : input

```json
{
	"rollno": "NCE080BCT103"
}
```

## Class APIs:

use /classes as url prefix

| Method | Endpoint |   Description   |
| :----: | :------: | :-------------: |
|  GET   |   `/`    | Get all classes |
|  POST  |   `/`    |  Create classs  |
|  PUT   |   `/`    |  Update classs  |
| DELETE |   `/`    |  Delete classs  |

### GET `/` : output

```json
[
	{
		"class_name": "A-101"
	},
	{
		"class_name": "A-103"
	},
	{
		"class_name": "A-104"
	},
	{
		"class_name": "A-105"
	}
]
```

### POST `/` : input

```json
{
	"class_name": "A-100"
}
```

### PUT `/` : input

```json
{
	"class_name": "A-100",
	"new_class_name": "A-109"
}
```

### DELETE `/` : input

```json
{
	"class_name": "A-100"
}
```

## Subject APIs:

use /subjects as url prefix

| Method | Endpoint |   Description    |
| :----: | :------: | :--------------: |
|  GET   |   `/`    | Get all subjects |
|  POST  |   `/`    |  Create subject  |
|  PUT   |   `/`    |  Update subject  |
| DELETE |   `/`    |  Delete subject  |

### GET `/` : output

```json
[
	{
		"subject_code": "ENCT351",
		"subject_id": 1,
		"subject_name": "Artificial Intelligence"
	},
	{
		"subject_code": "ENCT205",
		"subject_id": 2,
		"subject_name": "Data Communication"
	}
]
```

### POST `/` : input

```json
{
	"subject_name": "Data Communication",
	"subject_code": "ENEX203"
}
```

### PUT `/` : input

```json
{
	"subject_id": "3",
	"new_subject_code": "ENCT303", // either code or name or both
	"new_subject_name": "Data Communication"
}
```

### DELETE `/` : input

```json
{
	"subject_id": "2"
}
```

## Dashboard API:

use /dashboard as url prefix

| Method | Endpoint | Description |
| :----: | :------: | :---------: |
|  GET   |   `/`    | Get summary |

### GET `/` : output

```json
{
	"subject_distribution": [
		{
			"count": 45,
			"subject": "Artificial Intelligence"
		},
		{
			"count": 89,
			"subject": "Data Communication"
		},
		{
			"count": 12,
			"subject": "Engineering Mathematics II"
		}
	],
	"today": {
		"absent": 12,
		"attendance_rate": 0.95,
		"present": 228
	},
	"weekly_trend": [
		{
			"date": "2026-07-20",
			"rate": 0.89
		},
		{
			"date": "2026-07-21",
			"rate": 0.78
		},
		{
			"date": "2026-07-22",
			"rate": 0.8
		},
		{
			"date": "2026-07-23",
			"rate": 0.87
		},
		{
			"date": "2026-07-24",
			"rate": 0.76
		}
	]
}
```
