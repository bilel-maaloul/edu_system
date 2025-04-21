
import { useState } from "react";
import { MessageSquare, Search, Send, Phone, Video, User, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Sample conversation data
const contacts = [
  {
    id: "c1",
    name: "Admin User",
    role: "admin",
    email: "admin@eduarch.com",
    lastMessage: "Can you help with a student issue?",
    lastMessageTime: "10:15 AM",
    unread: 0,
    online: true,
  },
  {
    id: "c2",
    name: "Teacher User",
    role: "teacher",
    email: "teacher@eduarch.com",
    lastMessage: "When is the next faculty meeting?",
    lastMessageTime: "Yesterday",
    unread: 2,
    online: true,
  },
  {
    id: "c3",
    name: "Student User",
    role: "student",
    email: "student@eduarch.com",
    lastMessage: "I need help with my assignment",
    lastMessageTime: "2 days ago",
    unread: 0,
    online: false,
  },
  {
    id: "c4",
    name: "Sarah Johnson",
    role: "student",
    email: "sarah.j@eduarch.com",
    lastMessage: "Thank you for the feedback!",
    lastMessageTime: "3 days ago",
    unread: 0,
    online: false,
  },
  {
    id: "c5",
    name: "Michael Chen",
    role: "teacher",
    email: "michael.c@eduarch.com",
    lastMessage: "I've uploaded the lecture notes",
    lastMessageTime: "1 week ago",
    unread: 0,
    online: true,
  },
];

// Sample messages for a conversation
const initialMessages = [
  {
    id: "m1",
    sender: "c2",
    receiver: "self",
    content: "Hello, I have a question about the upcoming faculty meeting.",
    timestamp: new Date("2025-04-15T09:30:00"),
  },
  {
    id: "m2",
    sender: "self",
    receiver: "c2",
    content: "Sure, what would you like to know?",
    timestamp: new Date("2025-04-15T09:32:00"),
  },
  {
    id: "m3",
    sender: "c2",
    receiver: "self",
    content: "When is the next faculty meeting scheduled?",
    timestamp: new Date("2025-04-15T09:33:00"),
  },
  {
    id: "m4",
    sender: "self",
    receiver: "c2",
    content: "It's scheduled for next Thursday at 2:00 PM in the main conference room.",
    timestamp: new Date("2025-04-15T09:34:00"),
  },
  {
    id: "m5",
    sender: "c2",
    receiver: "self",
    content: "Great, thanks for the information! Will there be an agenda shared in advance?",
    timestamp: new Date("2025-04-15T09:35:00"),
  },
  {
    id: "m6",
    sender: "c2",
    receiver: "self",
    content: "Also, do I need to prepare anything for the meeting?",
    timestamp: new Date("2025-04-15T09:35:30"),
  },
];

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(contacts[1]); // Default to the second contact
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to send a new message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: `m${messages.length + 1}`,
      sender: "self",
      receiver: selectedContact.id,
      content: newMessage.trim(),
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully",
    });
  };
  
  // Function to format timestamp
  const formatMessageTime = (timestamp: Date) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Conversations</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0">
            <Tabs defaultValue="all" className="h-full flex flex-col">
              <div className="px-4">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="flex-grow m-0">
                <ScrollArea className="h-full">
                  <div className="px-4 py-2">
                    {filteredContacts.map(contact => (
                      <div 
                        key={contact.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-md cursor-pointer",
                          selectedContact?.id === contact.id 
                            ? "bg-muted" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg`} />
                            <AvatarFallback>
                              {contact.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {contact.lastMessageTime}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground truncate">
                              {contact.lastMessage}
                            </p>
                            {contact.unread > 0 && (
                              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {contact.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="unread" className="flex-grow m-0">
                <ScrollArea className="h-full">
                  <div className="px-4 py-2">
                    {filteredContacts.filter(c => c.unread > 0).map(contact => (
                      <div 
                        key={contact.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-md cursor-pointer",
                          selectedContact?.id === contact.id 
                            ? "bg-muted" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg`} />
                            <AvatarFallback>
                              {contact.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {contact.lastMessageTime}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground truncate">
                              {contact.lastMessage}
                            </p>
                            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                              {contact.unread}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredContacts.filter(c => c.unread > 0).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No unread messages</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          You're all caught up!
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg`} />
                        <AvatarFallback>
                          {selectedContact.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {selectedContact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">{selectedContact.name}</CardTitle>
                      <CardDescription>
                        {selectedContact.online ? "Online" : "Offline"} • {selectedContact.role}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow p-0 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-24rem)]">
                  <div className="p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.sender === "self" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-4 py-2",
                            msg.sender === "self"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p>{msg.content}</p>
                          <div
                            className={cn(
                              "text-xs mt-1",
                              msg.sender === "self"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {formatMessageTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="p-4 border-t">
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Conversation Selected</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Select a conversation from the list to start messaging.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
