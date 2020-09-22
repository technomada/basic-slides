# basic-slides
A simple way to share a static image slide presentation.

How to use:
```
$ sudo docker run -d --restart=always --name=slides --env MASTER_KEY="mk.21iqp" -p 3000:3000 -v /path/to/slides:/usr/src/app/slides technomada/basic-slides 
```

Visit
```
https://localhost:3000
```

```
LeftArrow  = back
RightArrow = forward
```

### Explainer
Provide a list of image files in a folder mappd to /usr/src/app/slides

Slides are shown according to the file name alpha sort.
