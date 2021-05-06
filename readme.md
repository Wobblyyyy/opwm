# Open Password Manager
Open-source web-based password manager.

## Features
- Military-grade AES-256 encryption.
- Automatic compression and decompression. (Lempel-Ziv-Welch)
- Up to 512 kB of storage per vault.
- Unlimited vaults.
- Safe cloud-based storage.
- Automatic password generation.

## How do vaults work?
Vaults are the central component behind opwm. Vaults are 100% secure and, with
current computing technology, would take billions (yes, that's right -
billions with a capital B) of years to crack. 

A vault is a bank vault of all your information and passwords. The entire
vault can be opened with a single passcode. This is a double-edged sword.
On one hand, you only need to use one password. On the other, if you make
your password something that's easily guessable, everything in your vault
can be unlocked by someone that got lucky with guessing your password.

Vaults use AES-256 military-grade encryption locally, on your machine. This
means that whatever computer you're using to access the vault is the only
computer in the world that sees all of your data without any unbreakable
encryption to cover it up. Vaults can only be unsealed with the same password
the vault was originally sealed with - nothing else is able to open it.

Vaults can be stored locally for added security. If you don't want your
information being stored online, or would like to make backup copies, you
can download your vault and upload it later. Local vaults use the same
type of encryption as any other vault and function identically. 

When using the cloud storage functionality of opwm, all of your data is
stored using Google's Firebase database. Don't worry - any data is fully
encrypted and unbreakable. Even if someone were to gain access to your
account, they wouldn't be able to decrypt your vaults. 

### Front-end
Vaults have several core elements.

#### Folders
Folders work exactly as you'd imagine they would. A folder can store either
other folders or files. You can have up to 32 levels of subfolders.

#### Files
Files are where the important stuff is stored. Files are made up of several
fields, each of which can be customized. Files do not allow for nested
folders or nested files - check out folders for that.

#### Fields 
Fields are key-value pairs. Each key is a string name of the field's
contents - take "username" or "password" as a prime example. Each value
is a string of text, such as the value of your username (wobblyyyy in my
case), a password (not gonna put that one there), or whatever else you want.

You can create an infinite amount of fields in a file. Prime examples
include...
- Username
- Email
- Password
- Security questions and answers
- Private keys
- GitHub tokens
- Activation codes
- Credit card numbers
- CVV
- Dates
- Poems
- Stories
- Whatever else you can imagine.

### Technology
Vaults are actually just JSON objects that are transformed into strings,
compressed, encrypted, and stored. To re-open a vault, we decrypt the vault's
cipher text, decompress the stored data, and parse the JSON data into a tree
we can utilize. 

## Security Promise
opwm was designed for a single reason. Actually, two, but that's not the
point. 
- A friend of mine mentioned that they didn't know of any good password
  managers they could use. Being the bored developer I am, I decided to
  create my own.
- More importantly, opwm is an open-source and free password manager.
  I can't steal your data. If you don't believe me, you can check for
  yourself - there's no possible way I could steal your data without
  hacking your machine on an operating system level. 
  
I, as the developer behind opwm, solemnly swear that so long as AES-256
encryption remains unbreakable, any data you store in opwm is 100%
safe and secure.

## Encryption
opwm utilizes 128-bit RSA keys and 256-bit AES encryption. This form of
encryption is well-regarded to be unbreakable. Unless you have the password
used to encode the data, it can't be decoded.

### We can't see your data
Your data is encrypted and decrypted locally, on your machine. We don't see
your master password, your passwords, or even the name of the accounts you
store in our vaults. 

### Your data can't ever be recovered
If you forget your password, you're out of luck. All of the data stored in your
vault will be sealed there forever until you remember the password. 

## Compression
Data stored in vaults is stored in JSON (Javascript Object Notation) objects
while on your machine. Before encrypting your JSON data, we utilize an LZ
compression algorithm to minimize the size of your stored data. This allows
you to store more data, cuts down on internet use, all while making opwm
an even more secure platform.

<!--
oooooooooommmmmmmmmmoooooooooommmmmmmmmmoooooooooommmmmmmmmmoooooooooommmmmmmmmm
-->
