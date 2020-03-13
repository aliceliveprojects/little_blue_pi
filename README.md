# little_blue_pi
Please note: this example has copied files under Apache License from
https://github.com/evothings/evothings-examples, with grateful thanks.


This BLE example allows a BLE client to nominate a data object, then access the data within it, via a UART-like interface.


# Interface


## characteristics

clients are identified by a client id
we assume a single client, doing a read, write, notify operation
BLE does not support multiple clients connected to a peripheral.

all parameters are sent to the characteristic as:

{
    "value" : json_value
}

It's so that we can run a simple JSON parse as a first pass validation.


write: makes a 'call' with an argument
read: returns the argument to the call
notify: makes the call, and subscribes in order to get the large ammount of data to be returned.


### set-dir: 

**write**
long write: utf-8 buffer: string: path
if no value, will return the current directory. Default is '/'.

**read**
returns the path written

**notify**
reads the directory.

1 chunk, integer as UTF-8 string
representing the number of chunks to follow.

string chunks of buffer

buffer contains:
JSON array of directory members:

```
{
    "p":"/",
    "m":
[   
    {
    "n":"example_directory",
    "d": 1
    },
    {
    "n":"example_file.zip"
    "d": 0
    }
]
}
```
p = path - absolute path of currently defined directory
m = members - array
n = name of member
d = directory flag: 0 = false


### get-file
**write**
long write: utf-8 buffer: string: name of file in the directory of 'set-dir'

**read**
reads the filename given in write

**notify**
reads the file.

string chunks of buffer

buffer contains:
utf-8 encoded content of file

### delete-file
**write**
long write: utf-8 buffer: string: name of file (from set-dir)

**read**
response: 200 OK
response: -404 not found
response: -403 forbidden