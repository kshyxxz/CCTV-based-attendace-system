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
	"class_id": 1,
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
	"class_id": 1,
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
