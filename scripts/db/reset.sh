#!/bin/bash

rm -f prisma/migrations
~/.bun/bin/bun x prisma db push
~/.bun/bin/bun x prisma db seed
~/.bun/bin/bun x prisma generate
