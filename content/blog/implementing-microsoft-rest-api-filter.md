---
title: "Implementing Microsoft REST API Filter"
description: >
  Enterprise organizations try to adapt Microsoft REST API Guidelines as a basis for their services more and more.
  Something is simple to follow, something is not, like $filter.
  In this post I will show you how to work with $filter outside the Microsoft tooling.
date: 2022-07-12T06:00:00+03:00
blog/categories:
  - How tos
blog/tags:
  - Microsoft REST API Guidelines
  - Kotlin
  - Java
  - ANTLR
---

Enterprise organizations try to adapt Microsoft REST API Guidelines[^1] as a basis for their services more and more.
Overall, this is a good idea.
Few points why:

1. Everybody likes standards
1. It's good to stand on the shoulder of the giants who developed good practices which are proven by time

Something is simple to follow, something is not, like `$filter`.

Some time ago I searched for a good examples of how `$filter` can be implemented to match the guidelines requirements[^2].
Have not found such example, so here is mine for you!

By looking at `$filter` you might draw a parallel with OData Filter[^3] and you would be right.
Microsoft definitely are inspired by OData because:

- They are OData initiators[^4]
- ASP.NET (Microsoft thing) even has an out-of-the-box tooling to create OData server[^5]

But guidelines are generic, they should be applicable to any tooling.
As we know, many enterprises are built using Java.

In this post I will show you how to work with `$filter` outside the Microsoft tooling.

## The problem

Looking at the requirements we can see the following challenges that should be solved:

- Filter has set of operations that SHOULD be supported
- Logical, comparison and grouping operators[^6] SHOULD be implemented to support the operations

Data should be queryable like so:

```txt
GET https://api.contoso.com/v1.0/products?$filter=(name eq 'Milk' or name eq 'Eggs') and price lt 2.55
```

Goal of the solution is translsate the following query:

```txt
(name eq 'Milk' or name eq 'Eggs') and price lt 2.55
```

Into some database query:

```sql
WHERE (name='Milk' OR name='Eggs') AND price < 2.55
```

## Writing a parser

To solve such problem (translate one thing into another) parsers[^7] are used.

Parsers usually construct the tree that can be traversed.
We could traverse it, extract tokens and create a query.
Tokens are nodes in a tree.
This is a task of lexer[^8] to understand what nodes (tokens) are there in a string.

I will not dive in the topic of compilers[^9] in this post but when Lexers and/or Parsers are mentioned, usually it means that compliers topic is touched.

Tree that we aim to construct for the string above should look close to this one:

```txt
            -------and------
           /                \
      ----or----            lt
     /          \         /    \
    eq          eq     price  2.55
  /    \      /    \
name 'Milk' name 'Eggs'
```

Then, for Mongo, we would be able to construct the following query walking this tree:

```txt
{ $and: [
    { $or: [
        { name: { $eq: "Milk" } },
        { name: { $eq: "Eggs" } }
      ]
    },
    { price: { $lt: 2.55 } }
  ]
}
```

Sounds fun, huh?
But before going further let me ask a question.
Do we want to write our own complier for this task?
No!

Still, we need somehow to defined the language (grammar), feed it to some tool which then will be able to understand how to construct a tree from the given string.
Seems like a Machine Learning task nowadays, right?
No!

## Welcome ANTLR

Thankfully, there is ANTLR (ANother Tool for Language Recognition)[^10] which does what we need:

1. We can describe the language
1. Give tool a text
1. It will construct the tree
1. We will be able to walk it

First, we need to create the grammar for our `$filter` language.
Grammar in ANTLR is described in a similar to Backus–Naur (BNF) form[^11].
Not diving into the details we will end-up with the following grammar.
You should read it from bottom to top.
If you are interested in more details of what's happening here I'm highly suggesting to go through the fantastic ANTLR Mega Tutorial[^12].
On the high level I will explain it after the snippet.

```antlr
grammar Filter;

filter: expr+ EOF ;

expr
 : OPAR expr CPAR
 | NOT PROPERTY COMPARISON VALUE
 | PROPERTY COMPARISON VALUE
 | expr AND expr
 | expr OR expr
 ;

OPAR: '(' ;
CPAR: ')' ;

OR  : 'or' ;
AND : 'and' ;

NOT : 'not' ;

COMPARISON: (GT | GE | LT | LE | EQ | NE);

GT : 'gt' ;
GE : 'ge' ;
LT : 'lt' ;
LE : 'le' ;
EQ : 'eq' ;
NE : 'ne' ;

VALUE
 : TRUE
 | FALSE
 | INT
 | FLOAT
 | STRING
 ;

TRUE
 : 'true'
 ;

FALSE
 : 'false'
 ;

PROPERTY
 : ALLOWED_CHARACTERS+ ('.' ALLOWED_CHARACTERS+)*
 ;

fragment ALLOWED_CHARACTERS : [a-zA-Z0-9_-];

STRING
 : '\'' (~['\r\n] | '\'\'')* '\''
 ;

INT
 : DIGIT+
 ;

FLOAT
 : DIGIT+ '.' DIGIT*
 | '.' DIGIT+
 ;

fragment DIGIT : [0-9] ;

SPACE
 : [ \t\r\n] -> skip
 ;
```

Taking some inspiration from OData `$filter` syntax in Azure Cognitive Search[^13] I came up with the grammar which you see above.
This grammar describes that:

1. Spaces, tabs and new lines are ignored for tokenization
1. Strings should be quoted in `'` and if you want to escape a quote in a string, e.g. `Mary's`, you should double it (`Mary''s`)
1. Numbers can be `0`, `0.0` or `.0`
1. Booleans are `true` and `false`
1. Expression are of various forms and those can have nested expressions

Time to code!

## Environment setup

Because ANTLR is Java based tool I will use a better Java language which is Kotlin[^14].

The setup is:

- Kotlin
- Gradle
- (optional) IntelliJ IDEA (I'm using Community Edition)

After default Kotlin project structure generation let's add the ANTLR.
Extend your `build.gradle.kts` file with the following lines:

```kt
plugins {
  antlr
}

dependencies {
  antlr("org.antlr:antlr4:4.10.1)
}

tasks.generateGrammarSource {
  maxHeapSize = "64m"
  arguments = arguments + listOf("-long-messages")
}

tasks.named("compileTestKotlin") {
  dependsOn(":generateTestGrammarSource")
}

tasks.named("compileKotlin") {
  dependsOn(":generateGrammarSource")
}
```

We've added ANTRL dependency and instructed Gradle to build classes from found grammars when we compile project or compiling tests.

## Creating grammar file

Now let's add our grammar which we defined higher in the post.

Create a file `Filter.g4` in the `main/antlr/com/your/path/antlr4` package and copy the content.

ANTLR will generate Lexer and Parses classes based on the grammar.
We want generated classes to be added to the package which is not `root`.
To do so we need to instruct ANTLR to add package definition to the generated class files.
Add the following:

```antlr
@header {
package com.your.path.antlr4;
}
```

to the `Filter.g4` file after the line `grammar Filter;`.

Now we are ready to write a class which will transform the input into Mongo query.
You can do the similar for another DB, I've chosen Mongo.

## Creating Listener

Create `FilterListener.kt` file and create a class:

```kt
class FilterListener : FilterBaseListener() {
  private var result: MutableList<String> = mutableListOf()
}
```

`FilterBaseListener` is a class generated by ANTLR.

I've named our class it `FilterListener` listener because we will use listener for this task, not visitor.
What is the difference between the two can be found in the Mega Tutorial listed above or in a nice summary on StackOverflow[^15].

List `result` is where values will be pushed during the query string construction.

We want to build something when exiting expression nodes.
For this we need to override the `exitExpr` method.

```kt
class FilterListener : FilterBaseListener() {
  override fun exitExpr(ctx: FilterParser.ExprContext?) {}
}
```

We are interested to run the code when we are leaving the `and`, `or` and comparison expressions.

```kt
class FilterListener : FilterBaseListener() {
  override fun exitExpr(ctx: FilterParser.ExprContext) {
    when {
      ctx.COMPARISON() != null -> buildComparison(
        property = ctx.PROPERTY().text,
        operator = ctx.COMPARISON().text,
        value = ctx.VALUE().text
      )
      ctx.AND() != null -> buildAnd()
      ctx.OR() != null -> buildOr()
    }
  }
}
```

Method `buildComparison` is responsible for constructing the valid Mongo Comparison Query Operator based on the data received.
Looks like this:

```kt
private fun buildComparison(property: String, operator: String, value: String) {
  val parsed = when {
    value == "true" || value == "false" -> value
    value.toDoubleOrNull() != null -> "${value.toDouble()}"
    else ->
      "\"${
      value
        .drop(1)
        .dropLast(1)
        .split("''")
        .joinToString("'")
      }\""
  }

  val q = when (operator) {
    "gt", "lt", "eq", "ne" -> comparisonQueryOperator(property, "\$$operator", parsed)
    "ge" -> comparisonQueryOperator(property, "\$gte", parsed)
    "le" -> comparisonQueryOperator(property, "\$lte", parsed)
    else -> throw Exception("operator $operator not implemented")
  }

  result.add(q)
}

private fun comparisonQueryOperator(property: String, operator: String, value: String): String {
  return "{ \"$property\": { $operator: $value } }"
}
```

How it works:

- If it's `true` or `false` then we just return these values because they are booleans.
- If it's something numeric, try to convert it to double.
- If it's not any from the above, it should be a string.
- Finally construct the query itself.

Because queries can be combined with help of `and` or `or` we need to implements methods which will create `and` and `or` queries from what is saved to the `result`.

```kt
private fun buildAnd() {
  val (left, right) = result
  result = mutableListOf()

  result.add("{ \$and: [ $left, $right ] }")
}

private fun buildOr() {
  val (left, right) = result
  result = mutableListOf()

  result.add("{ \$or: [ $left, $right ] }")
}
```

The `result` list will always have only left and right side of the tree (two values in the list).
AND and OR are combination of left and right parts.

## Traversing the built tree

Now it's time to write the public method which takes the raw filter as string and returns the Mongo query back.

```kt
fun generateQueryString(filter: String): String {
  // lexer
  val chars = CharStreams.fromString(filter)
  val lexer = FilterLexer(chars)

  // parser
  val tokens = CommonTokenStream(lexer)
  val parser = FilterParser(tokens)

  // walk
  ParseTreeWalker().walk(this, parser.filter())
  return result.last()
}
```

Here ANTLR classes are used to construct lexer, parser, filter, walk the tree and return the result.

## Checking that it works

In `Main.kt` you can now write the following:

```kt
fun main() {
  print("input filter: ")
  val filter = readln()
  val filterListener = FilterListener()
  println("output:")
  println(filterListener.generateQueryString(filter))
}
```

And try it out in the terminal:

```bash
input filter: name eq 'Milk'
output:
{ "name": { $eq: "Milk" } }
```

## Closing words

So this is how you can start building out the filter.
Hope this helps!
There is a [bigger example on GitHub](https://github.com/skibish/ms-rest-api-filter-implementation-example) that you can explore.
But please be aware that **this is an example and not production ready code to use**.
Use for inspiration.
PRs with improvements are welcome.

[^1]: https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md
[^2]: https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#97-filtering
[^3]: https://www.odata.org/getting-started/basic-tutorial/#queryData
[^4]: https://en.wikipedia.org/wiki/Open_Data_Protocol
[^5]: https://docs.microsoft.com/en-us/aspnet/web-api/overview/odata-support-in-aspnet-web-api/
[^6]: https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#971-filter-operations
[^7]: https://en.wikipedia.org/wiki/Parsing
[^8]: https://en.wikipedia.org/wiki/Lexical_analysis
[^9]: https://en.wikipedia.org/wiki/Compiler
[^10]: https://www.antlr.org
[^11]: https://en.wikipedia.org/wiki/Backus-Naur_form
[^12]: https://tomassetti.me/antlr-mega-tutorial
[^13]: https://docs.microsoft.com/en-us/azure/search/search-query-odata-filter
[^14]: https://kotlinlang.org
[^15]: https://stackoverflow.com/questions/20714492/antlr4-listeners-and-visitors-which-to-implement
