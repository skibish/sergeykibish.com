---
title: "Journey From Object-oriented Language to Go"
description: >
  A story of transformation.
  About Object-oriented programming and Go in general.
  About mistakes that I made during the journey from Object-oriented language to Go.
date: 2020-05-28T20:40:00+03:00
draft: false
---

## Preface

I was very surprised to see that [my talk](https://www.youtube.com/watch?v=1ZjvhGfpwJ8) which I gave at [DevFest Switzerland 2018](https://devfest.ch/) reached 11K views.
It's my most popular video on YouTube.
Not my, but with me speaking about something.

And I thought that it would be a good idea to save this talk in a written form.
Please welcome a post adaptation of this talk.

Enjoy!

## Intro

What I want to share is really a story of transformation.
About Object-oriented programming and Go in general.
About mistakes that I made during the journey from Object-oriented language to Go.
And a new way of thinking.

I hope that in the end you will have a desire to try Go one more time if you not liked it some time ago.
Maybe even make it #1 language for yourself or in your company.
Or if you already a Go user --- to convince somebody to join the squad.

I will start from definition of what is Object-oriented programming.
According to the [Wikipedia](https://en.wikipedia.org/wiki/Object-oriented_programming):

>Object-oriented programming (OOP) is a programming paradigm based on the concept of "objects", which may contain data, in the form of fields, often known as attributes; and code, in the form of procedures, often known as methods.

Or in other words OOP is a programming language model organized around objects rather than "actions" and data rather than logic.

For this story I've chosen Java as Object-oriented language to refer to because it is classic of Object-oriented world.
Still one of the most popular languages used for software development.

But what I will write about next --- applies to majority of Object-oriented programming languages.
Just swap Java with a language that you like more.

## The beginning

One of our colleagues discovered Go.
At that time there was no logo yet, only [famous mascot](https://blog.golang.org/gopher).
Which is still famous.
And he proposed a valid thing.
Let's try to create a service in Go.

But before diving into development, let's take a look at differences between Object-oriented language and Go and try to make a conclusion:
Is Go Object-oriented or not?
Can it be defined as such?

As you know, our world is flat and stands on three elephants.
Same true for Object-oriented world, but elephants are different.
They are:

- **Encapsulation**. Keeps the data and the code safe from external interference;
- **Inheritance**. Mechanism by which an object acquires some or all properties of another object;
- **Polymorphism**. Means to process objects differently based on their data type.

Does Go have all of these to call itself a Object-oriented programming language?

It has encapsulation because it can abstract things.
It doesn't have inheritance, instead it uses [composition](https://en.wikipedia.org/wiki/Composition_over_inheritance) very heavily.

Polymorphism...
To have full polymorphism inheritance is needed. Thus, not full polymorphism is here.

Let's start with examples that will show these language properties.

### Encapsulation

In the following example is seen encapsulation:

```java
public class Vehicle {
  protected final String brand;
  protected final Integer wheels;

  public Vehicle(String brand, Integer wheels) {
    this.brand = brand;
    this.wheels = wheels;
  }

  public Integer getSpeed() {
    return this.wheels * 5;
  }

  public String getBrand() {
    return this.brand;
  }
}
```

Brand and wheels attributes don't have direct access.

```java {hl_lines=["2-3"]}
public class Vehicle {
  protected final String brand;
  protected final Integer wheels;

  public Vehicle(String brand, Integer wheels) {
    this.brand = brand;
    this.wheels = wheels;
  }

  public Integer getSpeed() {
    return this.wheels * 5;
  }

  public String getBrand() {
    return this.brand;
  }
}
```

Only public methods can access these attributes.

```java {hl_lines=["10-12", "14-16"]}
public class Vehicle {
    protected final String brand;
    protected final Integer wheels;

    public Vehicle(String brand, Integer wheels) {
        this.brand = brand;
        this.wheels = wheels;
    }

   public Integer getSpeed() {
       return this.wheels * 5;
   }

   public String getBrand() {
       return this.brand;
   }
}
```

Now spot the differences.

```go
type Vehicle struct {
  brand  string
  wheels int
}

func (v *Vehicle) GetBrand() string {
  return v.brand
}

func (v *Vehicle) GetSpeed() int {
  return v.wheels * 5
}
```

1st one.
Go doesn't have classes.
It has structures instead.
Like in C, because Go was inspired by C/C++ and [was built as an alternative to C/C++](https://talks.golang.org/2012/splash.article).

```go {hl_lines=[1]}
type Vehicle struct {
    brand  string
    wheels int
  }

  func (v *Vehicle) GetBrand() string {
    return v.brand
  }

  func (v *Vehicle) GetSpeed() int {
    return v.wheels * 5
  }
```

2nd one.
Go doesn't have special access modifier keywords like `private`, `public`, `protected`.
It has exported and un-exported fields.
They are differentiated by first letters of variables, methods or functions.
Lower case --- un-exported, Capital --- exported.
These are package level visibilities.

```go {hl_lines=[2,3,6,10]}
type Vehicle struct {
    brand  string
    wheels int
  }

  func (v *Vehicle) GetBrand() string {
    return v.brand
  }

  func (v *Vehicle) GetSpeed() int {
    return v.wheels * 5
  }
```

At first glance this seems weird.
But after some time you realise that this is a big bonus, because it is easier to recognize in your code.

### Inheritance

This how inheritance looks in Java.

```java {hl_lines=[1]}
public class Car extends Vehicle {
  public Car(String brand) {
    super(brand, 4);
  }
}

Car car = new Car("Ford");
System.out.println(car.getBrand());
System.out.println(car.getSpeed());
// >> Ford
// >> 20
```

In Go composition is used.
Structure can be embedded anonymously or by using some property.
As you can see, composition can be achieved in two different ways.

```go {hl_lines=[2, 6]}
type Car struct {
  Vehicle
}

type Motorcycle struct {
  Base Vehicle
}
```

Using unnamed structure (embedding) code will look like it is using inheritance.
But it's not.

```go {hl_lines=[5, 6]}
car := &Car{
  Vehicle{"Ford", 4},
}

fmt.Println(car.GetBrand())
fmt.Println(car.GetSpeed())

// >> Ford
// >> 20
```

Or another approach by using properties explicitly.

```go {hl_lines=[5, 6]}
motorcycle := &Motorcycle{
  Base: Vehicle{"BMW", 2},
}

fmt.Println(motorcycle.Base.GetBrand())
fmt.Println(motorcycle.Base.GetSpeed())

// >> BMW
// >> 10
```

### Polymorphism

Now what about polymorphism?
How behavior of some methods can be changed?

In Java usual way is to overwrite method to change its behavior.
And this is how it looks like:

```java {hl_lines=["6-9"]}
public class Car extends Vehicle {
    public Car(String brand) {
        super(brand, 4);
    }

    @Override
    public Integer getSpeed() {
        return wheels * 3;
    }
}

Car car = new Car("Ford");
System.out.println(car.getBrand());
System.out.println(car.getSpeed());
// >> Ford
// >> 12
```

In Go interfaces can be used to mimic such behavior.

Let's add default method that will do main logic.

```go
func (v *Vehicle) ComputeSpeed() int {
 return v.wheels * 5
}
```

And create `Speeder` interface.
"Inherited" structures implement `GetSpeed()` interface method.
In Go there is no **implements** keyword.

```go {hl_lines=[5,9,13]}
func (v *Vehicle) ComputeSpeed() int {
  return v.wheels * 5
}

type Speeder interface {
  GetSpeed() int
}

func (c *Car) GetSpeed() int {
  return c.wheels * 3
}

func (m *Motorcycle) GetSpeed() int {
  return m.Base.ComputeSpeed()
}
```

If structure has a method with same signature, it means that it implements any interface that has same defined method signature.

And this is how it will work:

```go
fmt.Println(car.GetSpeed())
fmt.Println(motorcycle.GetSpeed())
```

To show a little bit more about how interfaces work in Go, here is another example:

```go {hl_lines=[5,9,10]}
type Speeder interface {
  GetSpeed() int
}

func printSpeed(s Speeder) {
  fmt.Println(s.GetSpeed())
}

printSpeed(car)
printSpeed(motorcycle)
```

I've created a function `printSpeed()` that receives structure that satisfies `Speeder` interface and prints speed to the output.

> **A note about interfaces.**
> In Go, interfaces are not declared somewhere specifically.
> Usually they are declared in place of their usage.
> You can see in example above that interface is located close to the consumer (`printSpeed()`).

This is considered to be a good practice.
Helps with readability and code understanding.

### Constructors

```go {hl_lines=[1, 8]}
func NewFord() *Car {
  return &Car{
    Vehicle{"Ford", 4},
  }
}

func main() {
  car := NewFord()

  printSpeed(car)
}
```

This is a common syntax for creating an instance of a structure in Go.
If you want to predefine something, then usually it is achieved with a function `NewSomething()`.

Now, question time!
Will following code work?
Without any initialization?

```go
func main() {
  car := &Car{}
  printSpeed(car)
}
```

Yes!
In Java constructors are defined that should be used for initialization of new instance.
If some variable is not set, during execution famous `NullPointerException` might be observed.
But in this case --- no exception was raised! Why???

### Zero values

Go has default values (or [zero values](https://tour.golang.org/basics/12)).
Everything is always initialized to something.
I've found it as a massive feature.

```go
type Vehicle struct {
  brand  string // ""
  wheels int    // 0
}
```

Vehicle was initialized like above.
Empty string and zero.
That's why `0` will be printed to the output in example with `printSpeed(car)`.

What else valuable Object-oriented language has?

### Enum

Enum is a quite powerful data type to represent enumerated data.

In Java enum looks like this.
Separate data type:

```java
public enum VehicleType {
  CAR,         // 0
  MOTORCYCLE,  // 1
  OTHER        // 2
}
```

In Go constants are used:

```go
const (
  CarType        = 0
  MotorcycleType = 1
  OtherType      = 2
)
```

But benefit of using enum is that explicit order is not defined.
And it is an awesome feature to use.
Very helpful during refactoring when is needed to move things around.
Has Go something similar?
Yes!

By using [iota](https://golang.org/ref/spec#Iota) identifier same result can be achieved.

```go
const (
  CarType        = iota // 0
  MotorcycleType        // 1
  OtherType             // 2
)
```

Go `iota` identifier is used in constant declarations to simplify definition of incrementing numbers.
Because it can be used in expressions, it provides possibilities beyond simple use of enumeration.

The value of `iota` is reset to `0` whenever the reserved word `const` appears in the source (i.e. after each `const` block)

Checkmate on this one.

What else?

### Generics

Go doesn't have generics.
That's good and bad.
But there is a [drafts for Go 2](https://github.com/golang/proposal/blob/master/design/go2draft-contracts.md).

### Exceptions

There are no exceptions in Go.
There are only errors and they are handled as follows:

```go
value, err := SomeNotSafeOperation()
if err != nil {
  log.Fatal(err)
}
```

This is common pattern when function return two values and second value is an error.
Yes this leads to verbosity in your code.
But verbosity is more transparency.

Somebody can tell me "But what about panics? They are like Exceptions!"

```go
panic("Oh, no")
```

A `panic` typically means that something went unexpectedly wrong.
Completely wrong.
Mostly they are used to fail fast on problems that shouldn't occur during normal operation.

Panics should be used **only in exceptional cases**.

But to be honest, panics are not for you.
"For whom, then?" will you ask me.
And I will not answer.
For the good for all of us.
**Forget about panics in your code.**

At this point all basics were covered.
It's time to return to the idea of the service creation.

Conclusion can be made that Go is not an Object-oriented language.

But what is Go about, then?

In my opinion Go is about:

- Simplicity ([KISS](https://en.wikipedia.org/wiki/KISS_principle));
- Minimalism;
- Transparency;
- and Predictability.

That's why big companies and products like [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), [Consul](https://www.consul.io/) bid heavily on Go currently.
And not on Java for some reason, you know.

With all of this in mind let's write a service!

## Writing a service

Very simple thing is needed.
Service that stores and renders information.
Very simple.

What is usually done after understanding of a final goal?
Tools are chosen, right?

If Object-oriented programming languages approach is used, I bet list will looks similar to this one:

- Libraries;
- IoC;
- Tools for testing.

Or in other words --- choose a framework!

How would you create such service in Java?

### Service in Java

In Java nowadays you will go with a framework.
And most likely with [Spring Boot](https://spring.io/projects/spring-boot).

Let's start to write a service by using framework.
Java approach.
Just a prototype, to make sure that idea works.

Will start from a controller.

```java
@RestController
@RequestMapping("/pages")
public class PagesController {

  @Post
  public IdDto create() {
    return "id";
  }

  @Get("/{id}")
  public PagesDto get(@PathVariable String id) {

  }
}
```

Controller will look something like this.
Very simple, classic routes for CRUD.
Annotations do a lot of stuff for us.
It looks more like "annotation programming".

`PagesDto` looks like this (DTO stands for Data Transfer Object):

```java
@JsonInclude(Include.NON_NULL)
public class PagesDto {
  private String id;
  private String title;
  private String body;

  // getters and setter
}
```

And DAO (Data Access Object, in other words --- entity) like this:

```java
@Entity
public class PagesDao {
  @Id private String id;
  private String title;
  private String body;

  // getters and setters
}
```

Repository is created to persist data:

```java
@Repository
public interface PagesRepository implements
        CrudRepository<PagesDao, String> {}

```

Service that is doing all the heavy lifting will look like this:

```java
@Service
public class PagesService {

  @Autowire private PagesRepository repository;
  @Autowire private PagesMapper mapper;

  public String create(PagesDto dto) {
    PagesDao dao = mapper.map(dto);

    return repository.save(dao);
  }

  public PagesDto get(String id) {
    PagesDto dto = mapper.map(repository.getById(id));

    return dto;
  }
```

As you see **@Autowire** annotation is used which is IoC (Inversion of Control) library.

Back to controller, wiring service in:

```java
@RestController
@RequestMapping("/pages")
public class PagesController {

    @Autowire private PagesService service;

    @Post
    public IdDto create(@RequestBody PagesDto dto) {
        String id = service.create(dto);
        return new IdDto(id);
    }

    @Get("/{id}")
    public PagesDto get(@PathVariable String id) {
        return service.get(id);
    }
}
```

Boom.
Done.
Directory structure of the project will looks like this:

```text
.
├── controllers
│   └── PagesController.java
├── dao
│   └── PagesDao.java
├── dto
│   ├── IdDto.java
│   └── PagesDto.java
├── mappers
│   └── PagesMapper.java
├── repositories
│   └── PagesRepository.java
└── services
    └── PagesService.java
```

Everything is in their place.

#### Summary

**Good**:

- Framework was used;
- Fast and easy to develop;
- IoC out of the box (@Autowire).

**Bad**:

- Annotations;
- Not transparent;
- A lot of things where you don't have control, it just works somehow;
- Super high level of abstraction.

But easy.
There is a nice quote about what is simple, and what is easy.

> **Simple**: a line of code that does something very small and specific.
>
> **Easy**: a line of code that does a lot by calling a framework function causing thousands of lines of code to be executed.
>
> --- [Ilya Sher](https://ilya-sher.org/2016/05/19/tips-for-beginning-systems-and-software-engineers/)

So, Object-oriented programming nowadays is more about second one.

### Service in Go

Now it is time to create same thing in Go.

The first mistake, that I did --- I thought about it "not in a Go way".
I was thinking not as a Go developer.
I wanted to jump in.
There are even [articles like this one](https://nemethgergely.com/learning-go-as-a-nodejs-developer/), for example.
In my opinion this is a bad read and a wrong path.
Correct way of learning would be to look around before diving in.

Go has a very big community, here are few Twitter handles that you can follow to get deeper into ideas and good practices.

- [@rob_pike](https://twitter.com/rob_pike)
- [@davecheney](https://twitter.com/davecheney)
- [@_rsc](https://twitter.com/_rsc)
- [@Sajma](https://twitter.com/Sajma)
- [@matryer](https://twitter.com/matryer)
- [@idanyliuk](https://twitter.com/idanyliuk)
- [@goinggodotnet](https://twitter.com/goinggodotnet)
- [@kelseyhightower](https://twitter.com/kelseyhightower)
- [@rakyll](https://twitter.com/rakyll)
- [@spf13](https://twitter.com/spf13)
- [@mitchellh](https://twitter.com/mitchellh)
- [@peterbourgon](https://twitter.com/peterbourgon)
- [@francesc](https://twitter.com/francesc)

> Learn Go as Go developer and from Go developers

In Java example framework was used, remember?
This was my another mistake.
Ask yourself --- why you need a framework?
Application has five routes only.
Five routes.
One database.
One model.
Why you need a framework?

Another thing is: Go has very rich standard library.
Use it.
Remember about KISS and minimalism.
Five routes.

For following example I will use separate library for routing which is used by many if not all Go frameworks out there.

First, let's create an API package that will be responsible for accepting requests:

```go
package api

// api/api.go

type API struct {
  storage *storage.Storage
  server  *http.Server
}
```

Then add a method that initializes router:

```go {hl_lines=["10-20"]}
package api

// api/api.go

type API struct {
  storage *storage.Storage
  server  *http.Server
}

func (a *API) bootRouter() *httprouter.Router {
  router := httprouter.New()

  router.POST("/pages", a.Create)
  router.GET("/pages", a.GetAll)
  router.GET("/pages/:id", a.Get)
  router.PUT("/pages/:id", a.Update)
  router.DELETE("/pages/:id", a.Delete)

  return router
}
```

Because dependency (storage) should be passed in, constructor function is created that accepts `storage` and return new instance of `api`:

```go {hl_lines=["10-14"]}
package api

// api/api.go

type API struct {
  storage *storage.Storage
  server  *http.Server
}

func NewAPI(storage *storage.Storage) *API {
 return &API{
    storage: storage,
  }
}

func (a *API) bootRouter() *httprouter.Router {
  router := httprouter.New()

  router.POST("/pages", a.Create)
  router.GET("/pages", a.GetAll)
  router.GET("/pages/:id", a.Get)
  router.PUT("/pages/:id", a.Update)
  router.DELETE("/pages/:id", a.Delete)

  return router
}
```

API should start somehow.
That's why separate `Start()` method is created.
Server is initialized there and start to listen for connections:

```go {hl_lines=["16-23"]}
package api

// api/api.go

type API struct {
  storage *storage.Storage
  server  *http.Server
}

func NewAPI(storage *storage.Storage) *API {
 return &API{
    storage: storage,
  }
}

func (a *API) Start(port string) error {
  a.server = &http.Server{
    Addr:    ":" + port,
    Handler: a.bootRouter(),
  }

  return a.server.ListenAndServe()
}

func (a *API) bootRouter() *httprouter.Router {
  router := httprouter.New()

  router.POST("/pages", a.Create)
  router.GET("/pages", a.GetAll)
  router.GET("/pages/:id", a.Get)
  router.PUT("/pages/:id", a.Update)
  router.DELETE("/pages/:id", a.Delete)

  return router
}
```

Yes, I could call `http.ListenAndServe()` directly in the `Start()` function, but soon you will see why I went in this direction.

It is a good practice to shutdown server gracefully, so we also define `Shutdown()` method:

```go {hl_lines=["25-27"]}
package api

// api/api.go

type API struct {
  storage *storage.Storage
  server  *http.Server
}

func NewAPI(storage *storage.Storage) *API {
 return &API{
    storage: storage,
  }
}

func (a *API) Start(port string) error {
  a.server = &http.Server{
    Addr:    ":" + port,
    Handler: a.bootRouter(),
  }

  return a.server.ListenAndServe()
}

func (a *API) Shutdown() error {
  return a.server.Shutdown(context.Background())
}

func (a *API) bootRouter() *httprouter.Router {
  router := httprouter.New()

  router.POST("/pages", a.Create)
  router.GET("/pages", a.GetAll)
  router.GET("/pages/:id", a.Get)
  router.PUT("/pages/:id", a.Update)
  router.DELETE("/pages/:id", a.Delete)

  return router
}
```

Let's wire all the things in entry point --- `main.go`.

Create instance of `api`:

```go {hl_lines=[6]}
package main

// main.go

func main() {
  a := api.NewAPI()
}
```

Now it should be started.
But to start, port is needed.

```go {hl_lines=["7-8"]}
package main

// main.go

func main() {

  apiPort := flag.String("port", "8080", "service port")
  flag.Parse()

  a := api.NewAPI()
}
```

In Go there is a `flag` package, that can be used for this purpose.
Now the default port is `8080`.
By using flag `-port` this value can be overwritten.

Now server can be started:

```go {hl_lines=["12-16"]}
package main

// main.go

func main() {

  apiPort := flag.String("port", "8080", "service port")
  flag.Parse()

  a := api.NewAPI()

  log.Printf("service is ready to listen on port: %s", *apiPort)
  if err := a.Start(*apiPort); err != http.ErrServerClosed {
    log.Printf("server failed: %v", err)
    os.Exit(1)
  }
}
```

For shutdown let's implement signal handling by using goroutine.

```go {hl_lines=["12-21"]}
package main

// main.go

func main() {

  apiPort := flag.String("port", "8080", "service port")
  flag.Parse()

  a := api.NewAPI(s)

  // shutdown gracefully
  go func() {
    sigs := make(chan os.Signal, 1)
    signal.Notify(sigs, os.Interrupt, syscall.SIGTERM)
    <-sigs
    log.Println("performing shutdown...")
    if err := a.Shutdown(); err != nil {
      log.Printf("failed to shutdown server: %v", err)
    }
  }()

  log.Printf("service is ready to listen on port: %s", *apiPort)
  if err := a.Start(*apiPort); err != http.ErrServerClosed {
    log.Printf("server failed: %v", err)
    os.Exit(1)
  }
}
```

And this is one of the things I love in Go.
I haven't seen anywhere, yet, so easy way of handling signals.
In other languages it is usually something very ugly.

Finally storage can be initialized:

```go {hl_lines=["10-11"]}
package main

// main.go

func main() {

  apiPort := flag.String("port", "8080", "service port")
  flag.Parse()

  r := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
  s := storage.NewStorage(r)
  a := api.NewAPI(s)

  // shutdown gracefully
  go func() {
    sigs := make(chan os.Signal, 1)
    signal.Notify(sigs, os.Interrupt, syscall.SIGTERM)
    <-sigs
    log.Println("performing shutdown...")
    if err := a.Shutdown(); err != nil {
      log.Printf("failed to shutdown server: %v", err)
    }
  }()

  log.Printf("service is ready to listen on port: %s", *apiPort)
  if err := a.Start(*apiPort); err != http.ErrServerClosed {
    log.Printf("server failed: %v", err)
    os.Exit(1)
  }
}
```

How storage looks like?
Separate package.
Like this:

```go
package storage

// storage/storage.go

type Storage struct {
  redis *redis.Client
}

func NewStorage(redis *redis.Client) *Storage {
  return &Storage{
    redis,
  }
}
```

Page model looks like below.
Field tags are specified for JSON serialization.

```go {hl_lines=["15-19"]}
package storage

// storage/storage.go

type Storage struct {
  redis *redis.Client
}

func NewStorage(redis *redis.Client) *Storage {
  return &Storage{
    redis,
  }
}

type Page struct {
  ID          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`
}
```

There are few methods in this package.
One example is listed below.
A little bit more verbose comparing to Java where you just specify annotations.
But in my opinion this is more transparent, because you see what is executed and what is checked:

```go
func (s *Storage) GetPageByID(id string) (p *Page, err error) {
  b, err := s.redis.Get(dbKey + id).Bytes()
  if err != nil {
    err = fmt.Errorf("failed to get page %s: %v", id, err)
    return
  }

  err = json.Unmarshal(b, &p)
  if err != nil {
    err = fmt.Errorf("failed to unmarshal %s: %v", id, err)
    return
  }

  return
}
```

Back to `api` package.
Let's wire `storage` into handler:

```go
func (a *API) Update(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

  id := ps.ByName("id")

  var page storage.Page
  err := json.NewDecoder(r.Body).Decode(&page)
  if err != nil {
    log.Printf("failed to decode body: %v", err)
    write(w, 400, nil)
    return
  }

  err = a.storage.UpdatePageByID(id, &page)
  if err != nil {
    log.Printf("failed to update page: %v", err)
    write(w, 500, nil)
    return
  }

  write(w, 200, okResponse())
}
```

I want to take your attention to this small detail:

```go {hl_lines=["1-3"]}
func okResponse() []byte {
  return []byte(`{"message":"Ok"}`)
}

func write(w http.ResponseWriter, statusCode int, body []byte) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(statusCode)
  _, err := w.Write(body)
  if err != nil {
    log.Printf("failed to write: %v", err)
  }
}
```

In Object-oriented world some class would be created for response representation.
But why you need to create separate class, if you know how successful response will always look like?
Why not just to write it like this straight away?

In the end application layout looks like this:

```text
.
├── api
│   ├── api.go
│   └── handlers.go
├── storage
│   └── storage.go
└── main.go

```

See the difference between Object-oriented style and current one?

When I first time started, I organized code around objects.
Like in Object-oriented style of programming.
Here code is organized around actions and logic.

#### Another Summary

**Good**:

- Simple;
- One way of doing things (mostly);
- Transparent;
- Explicitly defined dependencies.

Go is simple.
Obvious code, boring to write sometimes.
Because it will be the same.

Go is limited and not rich language comparing to Java.
In most cases you will have one option on how to solve the problem.
And this is good.

It is transparent.
You see, everything.

It's a good thing to define dependencies explicitly.
There are some DI libraries.
But think again --- do you need them?

**Bad**:

- Verbose;
- Obvious code (boring).

Bad thing that it is verbose.
This one is a plus and a minus at the same time.

Going back to the quote of simple vs easy.

> **Simple**: a line of code that does something very small and specific.
>
> **Easy**: a line of code that does a lot by calling a framework function causing thousands of lines of code to be executed.
>
> --- [Ilya Sher](https://ilya-sher.org/2016/05/19/tips-for-beginning-systems-and-software-engineers/)

I would say, Go is a simple language.
With no magic.

> Go is a sobering language.

## Recommended to watch

- [Go Proverbs](https://www.youtube.com/watch?v=PAAkCSZUG1c) by Rob Pike
- [7 common mistakes in Go and when to avoid them](https://www.youtube.com/watch?v=29LLRKIL_TI) by Steve Francia
- [Best Practices for Industrial Programming](https://www.youtube.com/watch?v=PTE4VJIdHPg) by Peter Bourgon
- [Advanced Testing with Go](https://www.youtube.com/watch?v=8hQG7QlcLBk) by Mitchell Hashimoto
- [Things in Go I Never Use](https://www.youtube.com/watch?v=5DVV36uqQ4E) by Mat Ryer
- [JustForFunc: Programming in Go](https://www.youtube.com/channel/UC_BzFbxG2za3bp5NRRRXJSw) by Francesc Campoy
- [Go Lift](https://www.youtube.com/watch?v=1B71SL6Y0kA) by John Cinnamond
- [Twelve Go Best Practices](https://www.youtube.com/watch?v=8D3Vmm1BGoY) by Francesc Campoy
